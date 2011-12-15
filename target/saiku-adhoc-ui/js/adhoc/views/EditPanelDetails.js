/**
 * Sets up workspace drop zones for DnD and other interaction
 */
var EditPanelDetails = EditPanel.extend({

	/*
	id: "edit_panel",
	

    template: function() {
        return _.template($("#template-edit-panel-details").html())();
    
    },
    */
    
    
    /*
    events: {
        'sortstop': 'select_dimension',
        'click a': 'selections',
        'click span': 'selections'
    },
    */
    initialize: function(args) {
   
        alert(args.elment);
  
  		_.extend(this, args);
  
  		this.workspace = args.workspace;
  
  		this.id = args.element;
  		
  		this.query = args.workspace.query;
  
        _.bindAll(this, "fetch_values", "populate", "render");
       
        this.render();
        
        this.fetch_values();
   
    },
    
    populate: function(model, response) {
  
		var template = _.template($("#template-column-setup").html())(); 

    	$("#edit_panel .edit_panel_body").empty();
        $("#edit_panel .edit_panel_body").hide().append(template).fadeIn('slow');
        
        

    },
    
    fetch_values: function() {

        this.workspace.query.action.get("/DETAILS/ELEMENT/" + this.id , { 
            success: this.populate
        });
    }
    
});
  