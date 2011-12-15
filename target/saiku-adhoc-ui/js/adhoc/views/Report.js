/**
 * Class which handles report rendering of resultsets
 */
var Report = Backbone.View.extend({
    className: "report_inner",
    
    initialize: function(args) {
        this.workspace = args.workspace;
        
        // Bind table rendering to query result event
        _.bindAll(this, "render", "process_data", "show_editor", "prevPage", "nextPage", "firstPage", "lastPage");
        
        this.workspace.bind('query:report', this.render);
                
       	this.workspace.bind('report:edit', this.show_editor);
       	
        //this.workspace.bind('report:render', this.attach_listeners);
        
       // this.edit_panel = new EditPanelDetails();
        
        
    },
    
    template: function() {
       return _.template($("#navigator").html())();
    },
    
    
    show_editor: function(event) {

        var splits = event.id.split('-');
 		var ele = splits[2] + '-' + splits[3] + '-' + splits[4];

		this.workspace.query.lastEditElement = event.id;

        this.workspace.edit_panel.fetch_values(event.id, event.type);

    },
    
    
    render: function(html) {

        _.delay(this.process_data, 0, html);
        
    },
    
    process_data: function(json) {
    	
    	this.json = json.data;
    	
    	var html = json.data.data;

    	$(this.el).empty();
        $(this.el).html(html).wrapInner('<div class="report_border" />');
        $('.report_border').width($('.report_border table').width()+30);

		//Add the navigation template
		$(this.el).prepend(this.template());

		$(".report-navigator").width($(".report_border").width());
		    
		$(".report-navigator #curr_page").html(json.data.currentPage + 1);;		
		$(".report-navigator #off_page").html(json.data.pageCount).click();
		
		$(".report-navigator #prev").click(this.prevPage);
		$(".report-navigator #next").click(this.nextPage);
		$(".report-navigator #first").click(this.firstPage);
		$(".report-navigator #last").click(this.lastPage);
		    
		this.template_select = new SetupTemplate({
            workspace: this.workspace
       });

        this.workspace.query.trigger('report:render', {
            workspace: this.workspace,
            report: this
        });

    },
    
    prevPage: function(args) {
    	var currPage = parseInt($(".report-navigator #curr_page").html());
    	var acceptedPage = currPage > 1 ? currPage - 1 : 1; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },
        
    nextPage: function(args) {
    	var currPage = parseInt($(".report-navigator #curr_page").html());
    	var totalPages = this.json.pageCount;
    	var acceptedPage = currPage < totalPages ? currPage + 1 : totalPages; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },    

    firstPage: function(args) {
    	var currPage = parseInt($(".report-navigator #curr_page").html());
    	var acceptedPage = 1; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },

    lastPage: function(args) {
    	var totalPages = this.json.pageCount;
    	var acceptedPage = totalPages; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },
    
    no_results: function(args) {
        $(args.workspace.el).find('.workspace_results table')
            .html('<tr><td>No Report</td></tr>');
    },
    
    error: function(args) {
        $(args.workspace.el).find('.workspace_results table')
            .html('<tr><td>' + args.data[0][0].value + '</td></tr>');
    }
});