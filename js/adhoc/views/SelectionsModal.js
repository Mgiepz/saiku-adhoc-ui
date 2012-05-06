/*
 * SelectionsModal.js
 * 
 * Copyright (c) 2011, Marius Giepz, OSBI Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */
/**
 * Dialog for member selections
 */
var SelectionsModal = Modal.extend({
    type: "selections",
    
    buttons: [
        { text: "Save", method: "save" },
        { text: "Cancel", method: "close" }
    ],
    
    events: {
        'click a': 'call',
        'change #show_unique': 'show_unique'
    },
    
    initialize: function(args) {
        // Initialize properties
        _.extend(this, args);
        this.options.title = "Filter on " + this.name;
        this.message = "Fetching values...";
        this.show_unique = false;
        this.query = args.workspace.query;
        _.bindAll(this, "fetch_values", "populate", "finished");
        
        // Bind selection handlers
        _.extend(this.events, {
            'click div.selection_buttons a.form_button': 'move_selection'
        });
        
          
        // Resize when rendered
        this.bind('open', this.post_render);
        this.render();
        
        this.category = args.key.split('/')[1];
        this.column = args.key.split('/')[3];
        
        this.fetch_values();

    },

    fetch_values: function(category, column) {

        this.workspace.query.action.get("/FILTER/CATEGORY/" + this.category + "/COLUMN/" + this.column + "/result", { 
            success: this.populate
        });
    },
        
   populate: function(model, response) {
  
		if(response.dataType=="Date"){
			this.populate_datefilter(model, response);
		}	    
		else{
			this.populate_multiselect(model, response);
		}    
        // Show dialog
        Application.ui.unblock();
    },
    
    populate_datefilter: function(model, response) {
    	
     	var template = _.template($("#template-datefilter").html())(this);
     	$(this.el).find('.dialog_body').html(template);

		var selectedDateFrom = response.selectedValues[0];
		var selectedDateTo = response.selectedValues[1];

        $(this.el).find('.datepicker_from').datepicker({
        	dateFormat: "dd.mm.yy",
        	changeMonth: true,
        	changeYear: true,
        	defaultDate: selectedDateFrom,
        	//minDate: startDate,
        	//maxDate: endDate,
        	onSelect: function(date, input){     
        		//alert(date);    
        	}
      	});
      	
      	$(this.el).find('.datepicker_to').datepicker({        	
        	dateFormat: "dd.mm.yy",
        	changeMonth: true,
        	changeYear: true,
        	defaultDate: selectedDateTo,
        	//minDate: startDate,
        	//maxDate: endDate,
        	onSelect: function(date, input){    
        		//alert(date); 
        	}
      	});
     	
    },
 
    populate_multiselect: function(model, response) {
    	
   	try {
    		
    		var template = _.template($("#template-selections").html())(this); 
    		$(this.el).find('.dialog_body').html(template);
    		
			this.available_values = JSON.parse(response.availableValues).resultset;
			this.selected_values = response.selectedValues;

    		var used_values = [];
            // Populate both boxes
 
 			if(this.selected_values!=null){
            $(this.el).find('.used_selections select').removeAttr('disabled');
            for (var j = 0; j < this.selected_values.length; j++) {
                var value = this.selected_values[j];
                //if (value.levelUniqueName == this.value.level &&
                //    member.type == "MEMBER") {
                    $("<option />").text(value)
                        .val(value)
                        .appendTo($(this.el).find('.used_selections select'));
                    used_values.push(value);
                //}
            }
 			} 
            
            // Filter out used values
            this.available_values = _.select(this.available_values, function(obj) {
                return used_values.indexOf(obj[0]) === -1;
            });
           
            $(this.el).find('.available_selections select').removeAttr('disabled');
            for (var i = 0; i < this.available_values.length; i++) {

                var value = this.available_values[i];
			
			//More elegant to remove null with _underscore?
			if(value[0]!=null){
				
                $("<option />").text(value[0])
                    .val(value[0])
                    .appendTo($(this.el).find('.available_selections select'));
            }
            
            }
        } catch (e) {
            $(this.el).html("Could not load selections");
        }
    
    },
    
    post_render: function(args) {
        $(args.modal.el).parents('.ui-dialog').css({ width: "500px" });
    	this.center();
    },
    
    move_selection: function(event) {
        var action = $(event.target).attr('id');
        var $to = action.indexOf('add') !== -1 ? 
            $(this.el).find('.used_selections select') :
            $(this.el).find('.available_selections select');
        var $from = action.indexOf('add') !== -1 ? 
            $(this.el).find('.available_selections select') :
            $(this.el).find('.used_selections select');
        var $els = action.indexOf('all') !== -1 ? 
            $from.find('option') :$from.find('option:selected');
        $els.detach().appendTo($to);
    },
    
    show_unique: function() {
        $.each($(this.el).find('option'), function(i, option) {
            var text = $(option).text();
            $(option).text($(option).val());
            $(option).val(text);
        });
        this.show_unique = ! this.show_unique;
    },
    
    save: function() {
        // Notify user that updates are in progress
        var $loading = $("<div>Saving...</div>");
        $(this.el).find('.dialog_body').children().hide();
        $(this.el).find('.dialog_body').prepend($loading);
   
        var values = [];

		//Date
		if($(this.el).find('.selection_buttons').length == 0){
			var val_from = $(this.el).find('.datepicker_from').val();
				values.push({
					value : val_from
				});
			var val_to = $(this.el).find('.datepicker_to').val();
				values.push({
					value : val_to
				});
			
		}
		//StringArray
		else{
        	// Loop through selections
			$(this.el).find('.used_selections option')
				.each( function(i, selection) {
					var val = $(selection).text();
					values.push({
						value : val
					});
				});
		}	
     
        // Notify server
        this.query.action.post('/FILTER/CATEGORY/' + this.category + '/COLUMN/' + this.column + '/VALUES', { 
            success: this.finished,
            data: values// JSON.stringify(values)
        });
        
        return false;
    },
    
    finished: function() {
        $(this.el).dialog('destroy').remove();
        this.query.page=null;
        this.query.run();
    }
});