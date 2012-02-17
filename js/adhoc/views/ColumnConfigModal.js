/*
 * ColumnConfigModal.js
 * 
 * Copyright (c) 2012, Marius Giepz. All rights reserved.
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
 * Dialog for column configuration
 */
var ColumnConfigModal = Modal.extend({
    type: "columnconfig",
    
    buttons: [
        { text: "Save", method: "save" },
        { text: "Cancel", method: "close" }
    ],
    
    events: {
        'click a': 'call' 
    },
    
	changed: function(evt) {
		var target = $(evt.currentTarget);
  
    },    
    
    initialize: function(args) {
        // Initialize properties
        _.extend(this, args);
        this.options.title = "Setup Column " + this.name;
        this.message = "Fetching config...";
        this.show_unique = false;
        this.query = args.workspace.query;
        _.bindAll(this, "fetch_values", "populate", "finished", "changed", "add_calculated_column");
          
        // Resize when rendered
        this.bind('open', this.post_render);
        this.render();
        
      	this.category = args.key.split('/')[1];
        this.column = args.key.split('/')[3];
        this.index = args.index;
   
      if(!(this.category == 'CALCULATED' && this.column == 'NEW')){
      	this.fetch_values();
      }else{
      	
      	var temp = defaultCalcColumn;
      	
      	this.json = $.extend(true, {}, defaultCalcColumn);

      	this.populate();
      }

    },

    fetch_values: function(category, column) {

        this.workspace.query.action.get("/COLUMNS/CATEGORY/" + this.category + "/COLUMN/" + this.column + "/POSITION/" + this.index + "/config", { 
            success: this.populate
        });
    },

    populate: function(model, response) {

     	var template = _.template($("#template-column-setup").html())(this);

   	
     	if(response != null){
     		this.json = response;
     	}
     	
     	$(this.el).find('.dialog_body').html(template);
     	
     	$(this.el).find('#description').html(this.json.description);
     	
     	//formula element needs to be made visible
     	if(this.category == 'CALCULATED'){
     		$(this.el).find('#formula').removeClass('hide').find('.formula').val(this.json.formula);
     	}

     	$(this.el).find('#displayname input').val(this.json.name);
     	
     	$(this.el).find('#format input').val(this.json.formatMask);   	
     	if(this.json.fieldType=='Numeric'||this.json.fieldType=='Date'){
     		$(this.el).find('#format input').removeAttr('disabled');
     	}
     	
     	if(this.json.aggTypes!=null){
            for (var j = 0; j < this.json.aggTypes.length; j++) {
                var value = this.json.aggTypes[j];
                    $("<option />").text(AggTypes[value])
                        .val(value)
                        .appendTo($(this.el).find('#aggregation select'));
           	}
 		} 

		$(this.el).find('#aggregation select').val(this.json.selectedAggType);
		
		$(this.el).find('#show_unique').attr('checked', this.json.hideRepeating);
 
        for (var value in AggTypes) {
              $("<option />").text(AggTypes[value]).val(value)
                .appendTo($(this.el).find('#summary select'));    			
		}
            	
     	$(this.el).find('#summary select').val(this.json.selectedSummaryType);

     	// Show dialog
        Application.ui.unblock();
     		
    },
    
    post_render: function(args) {
        //$(args.modal.el).parents('.ui-dialog').css({ width: "200px" });
    },
    
    save: function() {
    	
    	this.json.name = $(this.el).find('#displayname input').val();
    	this.json.formatMask = $(this.el).find('#format input').val();   

		if(!$(this.el).find('#formula').hasClass('hide')){
			this.json.formula = $(this.el).find('#formula .formula').val();   		
		};

    	this.json.selectedAggType = $(this.el).find('#aggregation select').val();   
    	this.json.selectedSummaryType = $(this.el).find('#summary select').val();  


    	this.json.hideRepeating = $(this.el).find('#show_unique').is(':checked');  
    	
    	//this.json.elementFormat.horizontalAlignment = $(this.el).find('#alignment select').val();   
    	
 		//if(this.json.uid == null) this.json.uid = this.workspace.uniqueId('rpt-dtl-');
    	if(this.json.uid == null) this.json.uid = this.workspace.uniqueId('uid-');
    	
    	
        // Notify user that updates are in progress
        var $loading = $("<div>Saving...</div>");
        $(this.el).find('.dialog_body').children().hide();
        $(this.el).find('.dialog_body').prepend($loading);
       
        var self = this;
       
        // Notify server
            this.query.action.post("/COLUMNS/CATEGORY/" + this.category + "/COLUMN/" + this.column + "/POSITION/" + this.index + "/config", { 
            success: this.finished,
            error: this.finished,    
            data: this.json// JSON.stringify(values)
        });
        
        return false;
    },
    
    add_calculated_column: function(){
    	
    	var $selections = $(this.workspace.el).find('.columns ul');
	 	
		var $logicalColumn = $('.category_tree')
            .find('a[title="calc_column"]')
            .parent();

        var $clone = $logicalColumn.clone()
            .addClass('d_measure')
            .addClass('calculated')
            .attr("id",this.json.uid)
            .removeClass('hide');
          
            var href = '#CATEGORY/' + this.json.category + '/COLUMN/' + this.json.name;
            
            $clone.find('a[title="calc_column"]').attr("title",this.json.name).html(this.json.name)
            .attr("href",href);
 
            $clone.appendTo($selections);		 	
   },
    
    finished: function(response) {
    	
      	if(this.category == 'CALCULATED' && this.column == 'NEW'){
      		this.add_calculated_column();
        }
        
		$('li#' + response.uid ).find('.dimension').html(response.displayName);

        $(this.el).dialog('destroy').remove();
        this.query.run();
    }
});