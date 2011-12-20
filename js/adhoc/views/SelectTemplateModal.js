/**
 * Dialog for column configuration
 */
var SelectTemplateModal = Modal.extend({
    type: "selecttemplate",
    
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
        this.options.title = "Select Templates ";
        this.message = "Fetching Templates...";
        this.show_unique = false;
        this.query = args.workspace.query;
        _.bindAll(this, "fetch_values", "populate", "finished", "changed");
              
        // Resize when rendered
        this.bind('open', this.post_render);
        this.render();
  
        this.fetch_values();

    },

    fetch_values: function(category, column) {

        this.workspace.query.action.get("/../../discover/templates", { 
            success: this.populate
        });
    },

    populate: function(model, response) {

     	var template = _.template($("#select-template").html())(this);
     	
     	$(this.el).find('.dialog_body').html(template);

     	$templateSelect = $('#template-select');
     	
     	$.each(response, function() {
    		var name = this.name.split('.')[0] + ".png"; 
			var file = Settings.REST_URL + "/../resources/" + name;
			$templateSelect.append(
				'<option>' + file + '</option>'		
			);
		});
     	
     	/*
     	$('#template-carousel').jcarousel({wrap : "circular",
     	 itemVisibleInCallback: {
            onAfterAnimation:  function(carousel, item, idx, state){
            	alert(item);
            }
        }
     	
     	});
     	*/
     	
     	 $templateSelect.imageSelect();
     	
     	// Show dialog
        Application.ui.unblock();
     		
    },
    
    post_render: function(args) {
        $(args.modal.el).parents('.ui-dialog').css({ width: "200px" });
    },
    
    save: function() {
           
        return false;
    },
    
    finished: function() {
        $(this.el).dialog('destroy').remove();
        this.query.run();
    }
});