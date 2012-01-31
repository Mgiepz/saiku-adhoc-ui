/**
 * The workspace toolbar, and associated actions
 * 
 * This is the inner toolbar for each sub-query.
 * It has buttons like:
 * - ????
 * 
 * 
*/

var WorkspaceToolbar = Backbone.View.extend({
    enabled: false,
    events: {
        'click a': 'call',
        'change select' : 'changed'    
    },
    
    
    
    initialize: function(args) {
        // Keep track of parent workspace
        this.workspace = args.workspace;
        
        // Maintain `this` in callbacks 
         _.bindAll(this, "call", "changed", "reflect_properties", "run_query", "toggle_report", "calculated_column");
        
        // Redraw the toolbar to reflect properties
        this.workspace.bind('properties:loaded', this.reflect_properties);
        
        // Fire off workspace event
        this.workspace.trigger('workspace:toolbar:render', { 
            workspace: this.workspace
        });
        
        // Activate buttons when a new query is created or run
        this.workspace.bind('query:new', this.activate_buttons);
        this.workspace.bind('query:result', this.activate_buttons);
    },
    
    
    activate_buttons: function(args) {
        if (args.data && args.data.length > 0) {
            $(args.workspace.toolbar.el).find('.button')
                .removeClass('disabled_toolbar');            
        } else {
            $(args.workspace.toolbar.el).find('.button')
                .addClass('disabled_toolbar');
            $(args.workspace.toolbar.el)
                .find('.auto,.formula,.toggle_fields,.toggle_sidebar, .export_xls, .export_pdf, .export_csv,.cda,.prpt, .view, .report')
                .removeClass('disabled_toolbar');
        }
    },
    
    template: function() {
       return _.template($("#template-workspace-toolbar").html())();
    },
    
    render: function() {
        $(this.el).html(this.template());

        return this; 
    },
    

	changed: function(event){
		
		var that = this;
		
		this.workspace.query.action.get("/ROWLIMIT/" + $(event.target).val() , { 
            success: function(){
            	that.workspace.query.page=null;
            	that.workspace.query.run(true);
            }
        });
	},

    call: function(event) {
        //Determine callback
        var callback = event.target.hash.replace('#', '');
        
        //Attempt to call callback
        if (! $(event.target).hasClass('disabled_toolbar') && this[callback]) {
           this[callback](event);
        }
        
        return false;
    },
    
    run_query: function(event) {
        this.workspace.query.run(true);
    },

    toggle_report: function(event) {
		this.workspace.trigger('FSM:EToggle');
    },

    
    reflect_properties: function() {
        var properties = this.workspace.query.properties ?
            this.workspace.query.properties.properties : Settings.QUERY_PROPERTIES;
            
        // Set properties appropriately
        if (properties['saiku.adhoc.query.automatic_execution'] === 'true') {
            $(this.el).find('.auto').addClass('on');
        }
    },

    save_query: function(event) {
        if (this.workspace.query) {
            (new SaveQuery({ query: this.workspace.query })).render().open();
        }
    },

    automatic_execution: function(event) {
        // Change property
        this.workspace.query.properties
            .toggle('saiku.adhoc.query.automatic_execution').update();
        
        // Toggle state of button
        $(event.target).toggleClass('on');
    },
    
    toggle_fields: function(event) {
        $(this.workspace.el).find('.workspace_fields').toggle();
    },
    
    toggle_sidebar: function() {
        this.workspace.toggle_sidebar();
    },
    
   setup_report: function(event) {
   	    (new ReportSetupModal({
            workspace: this.workspace
        })).open();     
    },
   
   add_union: function(event) {
        alert("Union Queries are not yet implemented, sorry!");
    },
   
   add_join: function(event) {
        alert("Joined Queries are not yet implemented, sorry!");
    },

   calculated_column: function(event) {
   	
   	     // Launch column config dialog
        (new ColumnConfigModal({
            //target: $target,
            index: -1,
            name: 'calculated',
            key: 'CATEGORY/CALCULATED/COLUMN/NEW',
            workspace: this.workspace
        })).open();

   		//this.workspace.query.add_calculated_column();
        //alert("Calculated Columns are not yet implemented, sorry!");
    },    
 
    export_xls: function(event) {
        window.location = Settings.REST_URL +
            "/export/" + this.workspace.query.uuid + "/xls";
    },
    
    export_csv: function(event) {
        window.location = Settings.REST_URL +
            "/export/" + this.workspace.query.uuid + "/csv";
    },

    export_pdf: function(event) {
        window.location.href = Settings.REST_URL +
            "/export/" + this.workspace.query.uuid + "/pdf";
    },
    
    export_cda: function(event) {
        (new ExportFileModal({
            workspace: this.workspace,
            extension: "CDA"
        })).open();   
    },    

    export_prpt: function(event) {
        (new ExportFileModal({
            workspace: this.workspace,
            extension: "PRPT"
        })).open();   
    } 


});

