/*
 * DragResize.js
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

var WORKSPACE_FSM_CONFIG = {

	events: [	{name: 'ENew',			from: '*',				to: 'SReport'},
				{name: 'EToggle',		from: 'SReport',		to: 'STable'},
				{name: 'EToggle',		from: 'STable',			to: 'SReport'},
				{name: 'EReportError',	from: 'SReport',		to: 'SReportError'},
				{name: 'ETableError',	from: 'STable',			to: 'STableError'},
				{name: 'EReportResult',	from: '*',	to: 'SReport'},
				{name: 'ETableResult',	from: '*',	to: 'STable'}
			],

	callbacks: {
		onbeforestart: function(event, from, to) {
			//console.log("STARTING UP");
			$(workspace.el).find('.workspace_error').hide();	
		},
		onENew: function(event, from, to) {
			var view = this.view;
			//console.log("QUERY CREATED");
		},
		onSReport: function(event, from, to) {
			//console.log("ENTER   STATE: SReport");			
			var workspace = this.view;
			$('.workspace_toolbar .view').addClass("table");
			$(workspace.el).find('.workspace_error').hide();	
			$(workspace.el).find('.workspace_results').hide();
			$(workspace.el).find('.workspace_report').show();
			workspace.query.reportPerspective = true;
			workspace.query.page=null;
			workspace.query.run();		
		},
		onSTable: function(event, from, to) {
			//console.log("ENTER   STATE: STable");			
			var workspace = this.view;
			$('.workspace_toolbar .view').removeClass("table");
			$(workspace.el).find('.workspace_error').hide();	
			$(workspace.el).find('.workspace_report').hide();
			$(workspace.el).find('.workspace_results').show();
			workspace.query.reportPerspective = false;
			workspace.query.run();	
		},
		onSReportError: function(event, from, to) {
			//console.log("ENTER   STATE: SReportError");					
			var workspace = this.view;
			$(workspace.el).find('.workspace_report').hide();
			$(workspace.el).find('.workspace_results').hide();
			$(workspace.el).find('.workspace_error').show();	
			workspace.query.error.render();
		},		
		onSTableError: function(event, from, to) {
			//console.log("ENTER   STATE: STableError");					
			var workspace = this.view;
			$(workspace.el).find('.workspace_report').hide();
			$(workspace.el).find('.workspace_results').hide();
			$(workspace.el).find('.workspace_error').show();	
			workspace.query.error.render();
		},			
		onchangestate: function(event, from, to) {
			//console.log("CHANGED STATE: " + from + " to " + to);
		}
	}
}