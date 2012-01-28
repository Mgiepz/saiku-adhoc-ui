var WORKSPACE_FSM_CONFIG = {

	events: [	{name: 'ENew',		from: '*',			to: 'SReport'},
				{name: 'ETable',	from: 'SReport',	to: 'STable'},
				{name: 'EReport',	from: 'STable',		to: 'SReport'}
			],

	callbacks: {
		onbeforestart: function(event, from, to) {
			console.log("STARTING UP");
		},
		onENew: function(event, from, to) {
			console.log("QUERY CREATED");
		},
		onSReport: function(event, from, to) {
			console.log("ENTER   STATE: Report");
		},
		onSTable: function(event, from, to) {
			console.log("ENTER   STATE: Table");
		},
		onchangestate: function(event, from, to) {
			console.log("CHANGED STATE: " + from + " to " + to);
		}
	}
}