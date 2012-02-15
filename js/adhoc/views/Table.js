/*
 * Table.js
 * 
 * Copyright (c) 2011, Marius Giepz, OSBI Ltd. All rights reserved.
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
 * Class which handles table rendering of resultsets
 */
var Table = Backbone.View.extend({
    //tagName: "table",
    initialize: function(args) {
        this.workspace = args.workspace;
        
        // Bind table rendering to query result event
        _.bindAll(this, "render", "process_data");
        this.workspace.bind('query:result', this.render);
    },
    
    render: function(json) {
      
        _.delay(this.process_data, 0, json);
    },
    
    process_data: function(json) {
 
	  var data = json.data;
	  
		// Check if there is data
    if (data == null) {
           return this.no_results(json);
     }
    
      var tableContents = data.resultset;
      var columnNames = [];
      
     
      for (column in data.metadata) {
        columnNames.push({"sTitle": data.metadata[column].colName});
      }
      $(this.el).empty();
      $(this.el).html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="contents"></table>' );

					
      var oTable = $('#contents').dataTable({
      "aaData": tableContents, 
      "aoColumns": columnNames,
      "bAutoWidth": true,
      "bLengthChange": false,
      "iDisplayLength": 30,
      "bFilter": false,
	  "bSort": false,
      "bJQueryUI": false,
      "sPaginationType": "full_numbers",
      "sDom": '<"top"pt>rt<"bottom"fl><"clear">'
      });
     
      oTable.fnAdjustColumnSizing();
     
    },
    
    no_results: function(args) {
        $(args.workspace.el).find('.workspace_results table')
            .html('<tr><td>No results</td></tr>');
    },
    
    error: function(args) {
        $(args.workspace.el).find('.workspace_results table')
            .html('<tr><td>' + args.data[0][0].value + '</td></tr>');
    }
});