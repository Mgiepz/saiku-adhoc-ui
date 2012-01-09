/**
 * Dialog for member selections
 */
var TemplatesModal = Modal.extend({
    type: "templates",
    
    buttons: [
        //{ text: "Save", method: "save" },
        { text: "Cancel", method: "close" }
    ],
    
    initialize: function(args) {
        // Initialize properties
        _.extend(this, args);
        this.options.title = "Select Template ";
        this.message = "Fetching Templates...";
        this.options.resizable = true;
        this.query = args.workspace.query;
        this.data = args;
   
        _.bindAll(this, "fetch_values", "populate", "finished");

        // Resize when rendered
        this.bind('open', this.post_render);
        this.render();
        
        // Load template
        $(this.el).find('.dialog_body')
           .html(_.template($("#template-selection").html())(this));
          
        this.fetch_values();

    },
    
    fetch_values: function() {

        this.workspace.query.action.get("/../../discover/templates", { 
            success: this.populate
        });
    },
    
    populate: function(model, response) {

     	$caroussel = $('#template-carousel ul');
     	
     	$.each(response, function() {
    		var name = this.name.split('.')[0]; 

			var file = Settings.REST_URL + "/../resources/" + name;
			$caroussel.append(
				'<li id="'+ name +'" style="overflow: hidden; float: left; width: 170px; height: 145px;"><img src="' 
				+ file + '.png" width="75" height="75" alt="" /></li>'
			);
		});
     	
     	var query = this.workspace.query;
     	
     	
     	 //       query.template = item.id;
     	
     	var that = this;
     	
		$('#template-carousel').jcarousel({
			scroll: 1,
			visible: 3,
			wrap: 'circular',
			itemFallbackDimension: 300
		});


		$("#template-carousel").delegate("li", "click", function() {
    		var clickedItem = $(this).attr('id'); 
    		query.template = clickedItem;
    		that.finished();
    		//console.log(clickedItem);
		});

     	// Show dialog
        Application.ui.unblock();
     		
   },
    

    post_render: function(args) {
/*
		var height = $(document).height() - 600;
		var width = $(document).width() - 800;

		var top = ($(document).height() - height)/2 - 200;
		var left = ($(document).width() - width)/2;

        $(args.modal.el).parent().css({
            height: height,
            width: width,
            position: 'absolute',
            top: top,
            left: left
        });
        */
     
    },
    
    save: function() {          
        return false;
    },
    
    finished: function() {
        $(this.el).dialog('destroy').remove();
        this.query.run();
    }
    
});