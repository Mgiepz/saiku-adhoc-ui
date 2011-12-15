function() { alert('I am anonymous'); };

var ReportDesigner = Backbone.View.extend({
    initialize: function(args) {
    	
        this.workspace = args.workspace;
        
        // Create a unique ID for use as the CSS selector
        this.id = _.uniqueId("report_");
        $(this.el).attr({ id: this.id });
        
        // Bind table rendering to query result event
        _.bindAll(this, "render", "receive_data", "process_data", "show", 
            "setOptions");
        this.workspace.bind('query:result', this.receive_data);
        
        // Add chart button
        this.add_button();
        this.workspace.toolbar.report = this.show;
        
        // Listen to adjust event and rerender chart
        this.workspace.bind('workspace:adjust', this.render);
           
    },
    
    add_button: function() {
        var $chart_button = 
            $('<a href="#report" class="report button disabled_toolbar i18n" title="Report Designer"></a>')
            .css({ 'background': 
                "url('js/adhoc/plugins/ReportDesigner/report.png') 50% 50% no-repeat" });
        var $report_li = $('<li class="seperator"></li>').append($chart_button);
        $(this.workspace.toolbar.el).find("ul").append($report_li);
    },
    
    show: function(event, ui) {
        $(this.workspace.el).find('.workspace_results table').toggle();
        $(this.el).toggle();
        $(this.nav).toggle();
        $(event.target).toggleClass('on');
        
        if ($(event.target).hasClass('on')) {
            this.render();
        }
    },
    
    setOptions: function(event) {
        var type = $(event.target).attr('href').replace('#', '');
        try {
            this[type]();
        } catch (e) { }
        
        return false;
    },
    
    render: function() {
      //TODO  
    },
    
    receive_data: function(args) {
        return _.delay(this.process_data, 0, args);
    },
    
    process_data: function(args) {

    }
});

/**
 * init the reportdesigner plugin
 */
(function() {

            function new_workspace(args) {
            	
                args.workspace.report = new ReportDesigner({ workspace: args.workspace });
                alert("done");
            }
            
            // Attach Reportdesigner
            for(var i = 0; i < Application.tabs._tabs.length; i++) {
                var tab = Application.tabs._tabs[i];
                new_workspace({
                    workspace: tab.content
                });
            };

            Application.session.bind("workspace:new", new_workspace);
        
    })();
