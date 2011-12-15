var InplaceEdit = Backbone.Model.extend({
    initialize: function(args, options) {

        _.bindAll(this, "attach_listeners", "clicked_element");

        this.query = options.query;

        this.query.bind('report:render', this.attach_listeners);
    },
    
    attach_listeners: function(args) {  	
		//TODO: be more specific, only childs of report_inner
        $(args.report.el).find(".saiku").click(this.clicked_element).hover(
        function() { $(this).addClass("report-hover"); },
        function() { $(this).removeClass("report-hover"); }
   		 );
        
        
        //simulate click on last edited element    
        if(this.query.lastEditElement!=null){    
        	$(args.report.el).find("." + this.query.lastEditElement).first().click();
        }

    },
    
    clicked_element: function(event) {
    	
    	$target = $(event.target);
    	
    	$target = $(event.target).is('span') ?
            $(event.target).parent() : $(event.target);
    	
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

 		//all elements with the same class will be highlighted
 		if($('.' + elementClass).hasClass('adhoc-highlight')){
 			$('td').removeClass('adhoc-highlight');	
 			this.query.workspace.edit_panel.disable();
 		}else{
 			$('td').removeClass('adhoc-highlight');	
 			$('.' + elementClass).addClass('adhoc-highlight');	
 			this.query.workspace.trigger('report:edit', {
            	type: splits[1] , id: elementClass
        	});
 		}
 		
 		//If none is selected we dont want the selection to reappear after render
 		if(!$('.adhoc-highlight').length){
 			this.query.lastEditElement = null;
 		}		
    },
    
    check_input: function(event) {
        if (event.which == 13) {
            this.save_writeback(event);
        } else if (event.which == 27 || event.which == 9) {
            this.cancel_writeback(event);
        }
         
        return false;
    },
    
    save_writeback: function(event) {
        var $input = $(event.target).closest('input');
        this.set({
            value: $input.val(),
            position: $input.parent().attr('rel')
        });
        this.save();
        var value = $input.val();
        $input.parent().text(value);
    },
    
    cancel_writeback: function(event) {
        var $input = $(event.target).closest('input');
        $input.parent().text($input.parent().attr('alt'));
    },
    
    parse: function() {
        this.query.run();
    },
	
    url: function() {
        return this.query.url() + "/edit/" + this.get('position') + 
            "/" + this.get('value'); 
    }
});