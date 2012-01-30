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