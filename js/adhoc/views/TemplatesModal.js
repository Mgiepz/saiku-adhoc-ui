/**
 * Dialog for member selections
 */
var TemplatesModal = Modal.extend({
	type: "templates",

	buttons: [{
		text: "Save",
		method: "save"
	},{
		text: "Cancel",
		method: "close"
	}
	],

	events: {
		'click a': 'call',
		'change select' : 'changed'
	},

	initialize: function(args) {
		// Initialize properties
		_.extend(this, args);
		this.options.title = "Report Setup ";
		this.message = "Fetching Templates...";
		this.options.resizable = true;
		this.query = args.workspace.query;
		this.data = args;

		_.bindAll(this, "fetch_values", "populate", "finished","call","changed","page_portrait","page_landscape");

		// Resize when rendered
		this.bind('open', this.post_render);
		this.render();

		// Load template
		$(this.el).find('.dialog_body')
		.html(_.template($("#template-selection").html())(this));

		this.fetch_values();

	},
	call: function(event) {
		//Determine callback
		var callback = event.target.hash.replace('#', '');

		//Attempt to call callback
		if (! $(event.target).hasClass('disabled_toolbar') && this[callback]) {
			this[callback](event);
		}

		return false;
	},
	fetch_values: function() {
		this.workspace.query.action.get("/SETTINGS", {
			success: this.populate
		});
	},
	populate: function(model, response) {

		this.json = response;

		$caroussel = $('#template-carousel ul');

		var selected;
		var i = 1;

		$('#template_name').html(response.reportTemplate.name);
		
		$('#selectedFormat').empty();
		
		$.each(Application.session.page_formats, function() {
			$('#selectedFormat').append( new Option(arguments[1],arguments[1]) );
		});

		$(this.el).find("input[name=margin-top]").val(this.json.marginTop);
		$(this.el).find("input[name=margin-bottom]").val(this.json.marginBottom);
		$(this.el).find("input[name=margin-left]").val(this.json.marginLeft);
		$(this.el).find("input[name=margin-right]").val(this.json.marginRight);
		
		$("#selectedFormat option[value='" + this.json.pageFormat + "']").attr('selected', 'selected');
		
		$.each(Application.session.prpt_templates, function() {
			var name = this.name.split('.')[0];

			if(name == response.reportTemplate.name) {
				selected = i;
			}

			var file = Settings.REST_URL + Settings.RESOURCE_LOCATION + name;
			$caroussel.append(
			'<li id="'+ name +'" style="overflow: hidden; float: left; width: 170px; height: 145px;"><img src="'
			+ file + '.png" width="75" height="75" alt="" /></li>'
			);

			i++;

		});
		var query = this.workspace.query;

		var that = this;

		$('#template-carousel').jcarousel({
			scroll: 1,
			visible: 3,
			start: selected,
			wrap: 'circular',
			itemFallbackDimension: 300
		});

		$("#template-carousel").delegate("li", "click", function() {
			var clickedItem = $(this).attr('id');
			//query.template = clickedItem;
			$('#template_name').html(clickedItem);
			that.json.reportTemplate.name=clickedItem;
		});
		if(this.json.orientation==0) {
			$(this.el).find('.landscape').addClass('on');
		} else {
			$(this.el).find('.portrait').addClass('on');
		};

		// Show dialog
		Application.ui.unblock();

	},
	post_render: function(args) {
		/*
		 var height = $(document).height() - 600;
		 var width = $(document).width() - 800;

		 var top = ($(document).height() - height)/2 - 200;
		 var left = ($(document).width() - width)/2;

		 $(args.modal.el).parent().css({
		 height: height,
		 width: width,
		 position: 'absolute',
		 top: top,
		 left: left
		 });
		 */

	},
	changed: function(event) {
		var that = this;
		return false;
	},
	page_landscape: function(event) {
		$(this.el).find('.landscape').addClass('on');
		$(this.el).find('.portrait').removeClass('on');
		this.json.orientation = 0;
	},
	page_portrait: function(event) {
		$(this.el).find('.landscape').removeClass('on');
		$(this.el).find('.portrait').addClass('on');
		this.json.orientation = 1;
	},
	save: function() {

        this.json.pageFormat = $(this.el).find('#selectedFormat option:selected').val();
		
		// Notify server
		this.query.action.post('/SETTINGS', {
			success: this.finished,
			data: this.json// JSON.stringify(values)
		});

		return false;

	},
	finished: function() {
		$(this.el).dialog('destroy').remove();
		this.query.page=null;
		this.query.run();

	}
});