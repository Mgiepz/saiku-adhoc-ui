/*
 * ReportResult.js
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
 * Holds the resultset for a query, and notifies plugins when resultset updated
 */
var ReportResult = Backbone.Model.extend({
	initialize: function(args, options) {
		// Keep reference to query
		this.query = options.query;

	},
	parse: function(response) {

		this.query.workspace.trigger('FSM:EReportResult');

		this.query.workspace.trigger('query:report', {
			workspace: this.query.workspace,
			data: response
		});

		// Show the UI if hidden
		Application.ui.unblock();

	},
	url: function() {
		var template = this.query.template!=null ? this.query.template : "default";
		var page = this.query.page!=null ? this.query.page : "1";
		return encodeURI(this.query.url() + "/report/" + page);
	}
});