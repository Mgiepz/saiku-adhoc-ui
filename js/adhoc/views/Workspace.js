/**
 * The query workspace
 *
 * Represents one Compound CDA-Query with
 * Subqueries in different Tabs
 *
 */
var Workspace = Backbone.View.extend({
	className: 'tab_container',

	events: {
		'click .sidebar_separator': 'toggle_sidebar',
		'change .mdModels': 'new_query',
		'drop': 'remove_concept'
	},

	initialize: function(args) {

		// Maintain `this` in jQuery event handlers
		_.bindAll(this, "adjust", "toggle_sidebar", "prepare", "new_query",
		"init_query", "update_caption", "populate_selections" , "uniqueId");

		// Attach an event bus to the workspace
		_.extend(this, Backbone.Events);
		this.loaded = false;

		//this.bind('models:loaded',this.populate_selections);

		// Generate toolbar and append to workspace

		this.toolbar = new WorkspaceToolbar({
			workspace: this
		});
		this.toolbar.render();

		// Create drop zones
		this.drop_zones = new WorkspaceDropZone({
			workspace: this
		});
		
		this.drop_zones.render();
		
//-------------------------------------------------------
		this.fsm = fsm = StateMachine.create(WORKSPACE_FSM_CONFIG,{},this);
		
		//this.fsm.start();	
		//this.trigger('start');
//-------------------------------------------------------

		// Generate table
		this.table = new Table({
			workspace: this
		});

		// Generate report
		this.report = new Report({
			workspace: this
		});

		// Hier wird die neue query wieder zum server geschickt
		if (args && args.query) {
			this.query = args.query;
			this.query.workspace = this;
			this.query.save({}, {
				success: this.init_query
			});
		}

		this.idCounter = 0;

		//Flash cube navigation when rendered
		Application.session.bind('tab:add', this.prepare);

	},
	
	adjust: function() {
		 // Adjust the height of the separator
		console.log("body height " + $("body").height());
		 
        // Adjust the height of the separator
        $separator = $(this.el).find('.sidebar_separator');
        var heightReduction = 87;
        if (Settings.PLUGIN == true || Settings.BIPLUGIN == true) {
            heightReduction = 2;
        }
        $separator.height($("body").height() - heightReduction);
        $(this.el).find('.sidebar').height($("body").height() - heightReduction);
        
        // Adjust the dimensions of the results window
        $(this.el).find('.workspace_results').css({
            height: $(document).height() - $("#header").height() -
                $(this.el).find('.workspace_toolbar').height() - 
                $(this.el).find('.workspace_fields').height() - 40
        });
        
        // Adjust the dimensions of the report inner
        $(this.el).find('.report_inner').css({
            height: $(document).height() - $("#header").height() -
                $(this.el).find('.workspace-report-toolbar').height() - 
                $(this.el).find('.workspace_toolbar').height() - 
                $(this.el).find('.workspace_fields').height() - 80
        });        
        
        
        
        // Fire off the adjust event
        this.trigger('workspace:adjust', { workspace: this });
        
	},
	
	caption: function() {
		if (this.query && this.query.name) {
			return this.query.name;
		}

		return "Unsaved query (" + (Application.tabs.queryCount + 1) + ")";
	},
	
	template: function() {
		return _.template($("#template-workspace").html())({
			model_navigation: Application.session.model_navigation
		});
	},
	
	render: function() {
		// Load template
		$(this.el).html(this.template());

		// Show toolbar
		$(this.el).find('.workspace_toolbar').append($(this.toolbar.el));

		// Show drop zones
		$(this.drop_zones.el)
		.insertAfter($(this.el).find('.workspace_toolbar'));

		// Activate sidebar for removing elements
		$(this.el).find('.sidebar')
		.droppable({
			accept: '.d_measure, .d_dimension'
		});

		// Add results table
		$(this.el).find('.workspace_results')
		.append($(this.table.el));

		// Add results report
		$(this.el).find('.workspace-report-toolbar').append(_.template($("#report-toolbar").html())());
		$(this.el).find('.workspace_report_canvas').append($(this.report.el));

		//TODO: add report editpanel here
		this.edit_panel = new ElementFormatPanel({
			workspace: this,
			el: $(this.el).find('#format_toolbox')
		});
		this.edit_panel.render();

		//Adjust tab when selected
		this.tab.bind('tab:select', this.adjust);
		$(window).resize(this.adjust);

		// Fire off new workspace event
		Application.session.trigger('workspace:new', {
			workspace: this
		});

		if(Settings.START_WITH_REPORT) {
			$(this.el).find('.workspace_results').hide();
			$(this.el).find('.workspace_report').show();
		} else {
			$(this.el).find('.workspace_results').show();
			$(this.el).find('.workspace_report').hide();
		}

		return this;
	},
	
	clear: function() {
		// Prepare the workspace for a new query
		$(this.el).find('.workspace_results table,.connectable')
		.html('');

		$(this.el).find('.workspace_report .report_inner')
		.html('');

		// Trigger clear event
		this.trigger('workspace:clear');
	},

	reset_canvas: function() {
		// Prepare the workspace for a new query
		$(this.el).find('.workspace_results table')
		.html('');

		$(this.el).find('.workspace_report .report_inner')
		.html('');
		
		$(this.el).find('.workspace_error')
		.html('');

	},

	
	toggle_sidebar: function() {
		// Toggle sidebar
		$(this.el).find('.sidebar').toggleClass('hide');
		$(this.toolbar.el).find('.toggle_sidebar').toggleClass('on');
		var new_margin = $(this.el).find('.sidebar').hasClass('hide') ?
		5 : 265;
		$(this.el).find('.workspace_inner').css({
			'margin-left': new_margin
		});
	},
	
	toggle_report: function() {

		this.query.reportPerspective = this.query.reportPerspective ? false : true;
		$('.workspace_toolbar .view').toggleClass("table");

		$(this.el).find('.workspace_results').toggle();
		$(this.el).find('.workspace_report').toggle();

		this.query.run();

	},
	
	prepare: function() {
		// Draw user's attention to cube navigation
		$(this.el).find('.mdModels')
		.parent()
		.animate({
			backgroundColor: '#AC1614'
		}, 'fast')
		.animate({
			backgroundColor: '#fff'
		}, 'fast');

		if(!$(this.el).find('.workspace_report').is(':hidden')) {
			$('.workspace_toolbar .view').addClass("table");
		}
		
	},
	
	new_query: function() {
		// Delete the existing query
		if(!$(this.el).find('.workspace_report').is(':hidden')) {
			$('.workspace_toolbar .view').addClass("table");
		}

		if (this.query) {
			this.query.destroy();
		}

		// Initialize the new query
		this.selected_model = $(this.el).find('.mdModels').val();

		var mModelInfo = this.selected_model;

		var parsedModelInfo = this.selected_model.split('/');

		this.query = new Query({
			domainId: parsedModelInfo[0],
			modelId: parsedModelInfo[1]
		}, {
			workspace: this
		});

		// Save the query to the server and init the UI
		this.query.save();

		this.init_query();
	},
	
	init_query: function() {

		if(this.query.get('json')) {
			var json = JSON.parse(this.query.get('json'));
			this.selected_model = json.clientModelSelection;
		}

		// Find the selected cube
		if (this.selected_model === undefined) {
			this.selected_model = this.query.get('model');

		}

		$(this.el).find('.mdModels')
		.val(this.selected_model);

		// Clear workspace
		this.clear();

		if (this.selected_model) {

			// Create new DimensionList and MeasureList
			this.mdmodel_list = new MdModelList({
				workspace: this,
				mdModel: Application.session.mdModels[this.selected_model]
			});
			$(this.el).find('.category_tree').html('').append($(this.mdmodel_list.el));

		} else {
			// Someone literally selected "Select a model"
			$(this.el).find('.category_tree').html('');
			return;
		}

		this.populate_selections();

	},
	
	populate_selections: function() {

		//I only get past here once
		//i have to check wether the query has some loaded json model from the server

		if(this.query.get('json')) {
			var model = JSON.parse(this.query.get('json'));
		}

		if(model) {

			var columns = model.columns ? model.columns : false;

			var groups = model.groups ? model.groups : false;

			var parameters = model.parameters ? model.parameters : false;

			if(columns) {
				var $selections = $(this.el).find('.columns ul');

				for (var columns_iter = 0; columns_iter < columns.length; columns_iter++) {
					var column = columns[columns_iter];
					var name = column.name;

					var $logicalColumn = $(this.el).find('.category_tree')
					.find('a[title="' + name + '"]')
					.parent();

					var $clone = $logicalColumn.clone()
					.addClass('d_dimension')
					.appendTo($selections);

					$("<span />").addClass('sort').addClass(column.sort.toLowerCase()).prependTo($clone);
					
				}
			}

			if(groups) {
				var $groups = $(this.el).find('.group ul');

				for (var groups_iter = 0; groups_iter < groups.length; groups_iter++) {
					var group = groups[groups_iter];
					var name = group.groupName;

					var $logicalColumn = $(this.el).find('.category_tree')
					.find('a[title="' + name + '"]')
					.parent();

					var $clone = $logicalColumn.clone()
					.addClass('d_dimension')
					.appendTo($groups);
					
					$("<span />").addClass('sort').prependTo($clone);
				}
			}

			if(parameters) {
				var $filters = $(this.el).find('.filter ul');

				for (var filters_iter = 0; filters_iter < parameters.length; filters_iter++) {
					var filter = parameters[filters_iter];
					var name = filter.name;

					var $logicalColumn = $(this.el).find('.category_tree')
					.find('a[title="' + name + '"]')
					.parent();

					var $clone = $logicalColumn.clone()
					.addClass('d_dimension')
					.appendTo($filters);
					
					$("<span />").addClass('sprite').prependTo($clone);
				}
			}

			this.query.run();
		}
		
			// Make sure appropriate workspace buttons are enabled
			this.trigger('query:new', {
				workspace: this
			});
			
			//FSM
			this.trigger('FSM:ENew');

			// Update caption when saved
			this.query.bind('query:save', this.update_caption);
	},
	
	update_caption: function() {
		var caption = this.query.get('name');
		$(this.tab.el).find('a').html(caption);
	},
	
	remove_concept: function(event, ui) {
		this.drop_zones.remove_dimension(event, ui);
	},
	
	// Generate a unique integer id (unique within the entire client session).
	// Useful for temporary DOM ids.
	uniqueId : function(prefix) {
		var id = this.idCounter++;
		return prefix ? prefix + id : id;
	}
});