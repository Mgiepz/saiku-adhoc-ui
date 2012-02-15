/*
 * Report.js
 * 
 * Copyright (c) 2012, Marius Giepz. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */
/**
 * Class which handles report rendering of a report
 */
var Report = Backbone.View.extend({
    className: "report_inner",
    
    initialize: function(args) {
        this.workspace = args.workspace;
        
        // Bind table rendering to query result event
        _.bindAll(this, "render", "process_data", "show_editor", "prevPage", "nextPage", "firstPage", "lastPage");
        
        this.workspace.bind('query:report', this.render);
                
       	this.workspace.bind('report:edit', this.show_editor);

       	this.dragresize = new DragResize({workspace: this.workspace, el: $(this.el)});
        
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
       // .wrapInner('<iframe/>');
        $('.report_border').width($('.report_border table').width()+30);
	    
		$(".nav-container #curr_page").html(json.data.currentPage + 1);;		
		$(".nav-container #off_page").html(json.data.pageCount);
		
		//each click must only be bound once
		$(".nav-container").children().unbind();
		$(".nav-container #prev").click(this.prevPage);
		$(".nav-container #next").click(this.nextPage);
		$(".nav-container #first").click(this.firstPage);
		$(".nav-container #last").click(this.lastPage);
		
		this.dragresize.render();
		
		self = this;
		
		$(this.el).find('.col-header').mouseover(function(event){
			self.dragresize.summonDragResize(event);});

		$(this.el).find('.col-header').mouseout(function(event){
			self.dragresize.banishDragResize(event);});			

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