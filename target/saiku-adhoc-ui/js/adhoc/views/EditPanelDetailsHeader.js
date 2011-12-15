/**
 * Sets up workspace drop zones for DnD and other interaction
 */
var EditPanelDetailsHeader = Backbone.View.extend({
	id: "edit_panel",
	
    template: function() {
        return _.template($("#template-edit-panel-details-header").html())();
    },
    /*
    events: {
        'sortstop': 'select_dimension',
        'click a': 'selections',
        'click span': 'selections'
    },
    */
    initialize: function(args) {
        //this.workspace = args.workspace;
        //this.query.bind('report:render', this.render);
        // Maintain `this` in jQuery event handlers
        _.bindAll(this, "render");
    },
    
    render: function() {

    	$("#edit_panel").empty();
        $("#edit_panel").html(this.template());

        return this; 
    }
});
  