/**
 * Dialog for column configuration
 */
var ReportSetupModal = Modal.extend({
    type: "reportsetup",
    
    buttons: [
        { text: "Save", method: "save" },
        { text: "Cancel", method: "close" }
    ],
    
    events: {
        'click a': 'call'
        //,'change input' : 'changed',
        //'change select' : 'changed'      
    },
    
	changed: function(evt) {
		var target = $(evt.currentTarget);
		
		//for $.find('column-thingy).each({ json.x.push($this.find('bla')) });
		
   		//this.json[target.attr('id')] = target.attr('value');
      
    },    
    
    initialize: function(args) {
        // Initialize properties
        _.extend(this, args);
        this.options.title = "Setup Report " + this.name;
        this.message = "Fetching config...";
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

     	var template = _.template($("#report-setup").html())(this);
     	
     	$(this.el).find('.dialog_body').html(template);
     	
     	//$(this.el).find('#description').html(response.description);
     	$caroussel = $('#template-carousel ul');
     	
     	$.each(response, function() {
    		var name = this.name.split('.')[0] + ".png"; 
			var file = Settings.REST_URL + "/../resources/" + name;
			$caroussel.append(
				'<li><img src="' + file + '" width="75" height="75" alt="" /></li>'
			);
		});
     	
     	$('#template-carousel').jcarousel({wrap : "circular",
     	 itemVisibleInCallback: {
            onAfterAnimation:  function(carousel, item, idx, state){
            	alert(item);
            }
        }
     	
     	});
     	
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