/*
 * InplaceEdit.js
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
var InplaceEdit = Backbone.Model.extend({
    initialize: function(args, options) {

        _.bindAll(this, "attach_listeners", "clicked_element");

        this.query = options.query;

        this.query.bind('report:render', this.attach_listeners);
    },
    
    attach_listeners: function(args) {
    	
    	that = this;
 
        $(args.report.el).find(".saiku").click(this.clicked_element).hover(
        	//beginn hover
        	function() {   
 	
    			if(!$('.resizer.ui-draggable-dragging').length){
    				//return true;
        		that.block_highlight($(this), "report-hover");}
    			}        		
        		,
        		
     		
        	function() {}
   		 );
              
        //simulate click on last edited element    
        if(this.query.lastEditElement!=null){    
        	$(args.report.el).find("." + this.query.lastEditElement).first().click();
        }

    },
    
    clicked_element: function(event) {

    	var $target;
	
    	if($(event.target).hasClass('saiku')){
    		$target = $(event.target); 
    	}else{
    		$target = $(event.target).parent('.saiku'); 
    	};
    	
    	//$target = $(event.target).is('span') ?
        //    $(event.target).parent() : $(event.target);
		if(!$target) return false; 


    	var clazz = $target.attr('class').split(/\s+/);
    	
    	var elementClass;
    	
    	//find the relevant class
    	for (var i = 0; i < clazz.length; i++) {
                var c = clazz[i];
                if(c.substring(0, 3) == "rpt"){
                	elementClass=c;
                	break;
                }
 		}

 		var splits = elementClass.split('-');

 		this.query.workspace.edit_panel.disable_buttons();
 		
 		
 		//??????????
 		$('#dragzone').remove();
		
 		this.block_highlight($target, 'adhoc-highlight');
 		
 		this.query.workspace.trigger('report:edit', {
            	type: splits[1] , id: elementClass
        });

 		//If none is selected we dont want the selection to reappear after render
 		if(!$('.adhoc-highlight').length){
 			this.query.lastEditElement = null;
 		}		
    },
    
    block_highlight: function(target, clazzToAdd){

    	var clazz = target.attr('class').split(/\s+/);
    	
    	var elementClass;
    	
    	//find the relevant class
    	for (var i = 0; i < clazz.length; i++) {
                var c = clazz[i];
                if(c.substring(0, 3) == "rpt"){
                	elementClass=c;
                	break;
                }
 		}

 		var splits = elementClass.split('-');

 		//all elements with the same class will be highlighted
 		if($('.' + elementClass).hasClass(clazzToAdd)){
 			$('td').removeClass(clazzToAdd);	
 		}else{
 			$('td').removeClass(clazzToAdd);	
 			$('.' + elementClass).addClass(clazzToAdd);				
 		}

    }
    
});