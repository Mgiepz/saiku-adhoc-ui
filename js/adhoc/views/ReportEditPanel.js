/**
 * Sets up workspace drop zones for DnD and other interaction
 */
var ReportEditPanel = Backbone.View.extend({
    template: function() {
        return _.template($("#template-report-edit-panel").html())();
    },
    /*
    events: {
        'sortstop': 'select_dimension',
        'click a': 'selections',
        'click span': 'selections'
    },
    */
    initialize: function(args) {
        // Keep track of parent workspace
        this.workspace = args.workspace;
        this.query = args.query;
        
        //this.query.bind('report:render', this.render);
        // Maintain `this` in jQuery event handlers
        //_.bindAll(this, "select_dimension", "move_dimension", 
        //        "remove_dimension");
    },
    
    render: function() {
        // Generate drop zones from template
        $(this.el).html(this.template());
    
        return this; 
    }
});
  