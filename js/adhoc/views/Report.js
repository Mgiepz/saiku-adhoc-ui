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
        
    },
    
    template: function() {
       return _.template($("#report-toolbar").html())();
    },
    
    
    show_editor: function(event) {

        var splits = event.id.split('-');
 		var ele = splits[2] + '-' + splits[3] + '-' + splits[4];

		this.workspace.query.lastEditElement = event.id;

        this.workspace.edit_panel.fetch_values(event.id, event.type);

    },
    
    
    render: function(json) {

        // Check to see if there is data
        if (json.data && json.data.data.length === 0) {
            return this.no_results(json);
        }

        _.delay(this.process_data, 0, json);
        
    },
    
    process_data: function(json) {
    	
    	this.json = json.data;
    	
    	var html = json.data.data;

    	$(this.el).empty();
        $(this.el).html(html).wrapInner('<div class="report_border" />');
        $('.report_border').width($('.report_border table').width()+30);
	    
		$(".nav-container #curr_page").html(json.data.currentPage + 1);;		
		$(".nav-container #off_page").html(json.data.pageCount);
		
		//each click must only be bound once
		$(".nav-container").children().unbind();
		$(".nav-container #prev").click(this.prevPage);
		$(".nav-container #next").click(this.nextPage);
		$(".nav-container #first").click(this.firstPage);
		$(".nav-container #last").click(this.lastPage);

        this.workspace.query.trigger('report:render', {
            workspace: this.workspace,
            report: this
        });

    },
    
    prevPage: function(args) {
    	var currPage = parseInt($(".report-toolbar #curr_page").html());
    	var acceptedPage = currPage > 1 ? currPage - 1 : 1; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },
        
    nextPage: function(args) {
    	var currPage = parseInt($(".report-toolbar #curr_page").html());
    	var totalPages = this.json.pageCount;
    	var acceptedPage = currPage < totalPages ? currPage + 1 : totalPages; 	
    	this.workspace.query.page = acceptedPage;    
    	this.workspace.query.run(true);
    },    

    firstPage: function(args) {
    	var currPage = parseInt($(".report-toolbar #curr_page").html());
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
        $(this.el).html
            .html('<tr><td>No Report</td></tr>');
    },
    
    error: function(args) {
        $(this.el).html('<tr><td>' + args.data.error + '</td></tr>');
    }
});