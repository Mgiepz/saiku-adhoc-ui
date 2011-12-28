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
        		that.block_highlight($(this), "report-hover"); },
        	function() { }
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

 		this.query.workspace.edit_panel.disable();
 		
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