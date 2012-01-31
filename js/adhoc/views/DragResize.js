var DragResize = Backbone.View.extend({

	initialize: function(args) {

		this.workspace = args.workspace;

		_.bindAll(this, "render","summonDragResize","banishDragResize","submit","finished");

	},
	render: function() {

		//The resize-area
		$(this.el).append('<div id="resizearea" class="resize resize_region"/>');
		$('#resizearea').hide();

		//the drag-handle
		$('#resizearea').append('<div id="draghandle" class="resize resize_horizontal"/>');
		$('#draghandle').css('display', 'none')

		$('#resizearea').mouseover( function() {
			$('#draghandle').css('display', 'block');
		});
		$('#resizearea').mouseout( function() {
			$('#draghandle').css('display', 'none');
		});
	},
	summonDragResize: function(event) {

		if(!$(event.currentTarget).parent().children('.saiku').last().is($(event.currentTarget))) {

			var self = this;
			var colHeader = $(event.currentTarget);

			var colHeaderPos = colHeader.position();
			var colHeaderWidth = colHeader.width();
			var colHeaderHeight = colHeader.height();
			var areaWidth = $('#resizearea').width();

			$('#resizearea').css('top', colHeaderPos.top);
			$('#resizearea').css('left', colHeaderPos.left + colHeaderWidth - areaWidth) ;
			$('#resizearea').css('height', colHeaderHeight);

			$('#resizearea').show();

			$(event.currentTarget).parent().addClass('resizable_row');

			var borderPosition = $('.workspace_report_canvas').position();
			var borderHeight = $('.workspace_report_canvas').height();

			var borderTop = borderPosition.top;

			//calculate the containment

			var td_elements = $(event.currentTarget).add($(event.currentTarget).next("td"));

			//This will hold the extreme points of the containment
			var points = {
				left: td_elements.eq(0).position().left,
				top: td_elements.eq(0).position().top,
				right: 0,
				bottom: 0
			};

			//Find the points of the containment
			td_elements.each( function() {
				var t = $(this);
				var p = t.position();
				var width = t.width();
				var height = t.height();

				points.left = Math.min(p.left, points.left);
				points.top  = Math.min(p.top , points.top );
				points.right = Math.max( points.right, p.left + width);
				points.bottom = Math.max( points.bottom, p.top + height);
			});
			//while one header is dragging we must not allow others to be made draggable
			//the last column will also be disallowed
			var draggableHeight = $('.report_inner').height() - borderTop
			
			$helper = $('#resizer').addClass('resizer').css({height: draggableHeight});

			$('#draghandle').draggable({
				helper : function() {				
					/*
					.css({
						top: 0, //borderTop,
						//left: 0,
						height: draggableHeight
					}
					);
					*/
					return $helper.clone().removeAttr( "id" ).removeClass("hide").css({lef: colHeaderPos.left});
				} ,
				containment:  [points.left + 30, points.top, points.right - 30, points.bottom],
				axis: 'x',
				dragging: function(event,ui) {
					//event.stopPropagation();
				},
				stop : function(event,ui) {
					var $ele = $('.resizable_row');
					var containmentWidth = $ele.width();

					var delta = ui.position.left - ui.originalPosition.left;
					var one = 100 / containmentWidth;
					var prcChange = one * delta;

					var clazz = colHeader.attr('class').split(/\s+/);

					var elementClass;

					//find the relevant class
					for (var i = 0; i < clazz.length; i++) {
						var c = clazz[i];
						if(c.substring(0, 3) == "rpt") {
							elementClass=c;
							break;
						}
					}
					if(ui.position.left != (points.left + 30) && ui.position.left != (points.right - 30)) {
						self.workspace.query.action.get("/FORMAT/ELEMENT/" + elementClass , {
							success: function(model, response) {
								self.submit(model, response, prcChange, elementClass);
							}
						});
					}
				}
			});

		}

	},
	banishDragResize: function(event) {

		var el = event.relatedTarget;
		var position = $(el).offset()
		var height = $(el).height()
		var width = $(el).width()
		if (event.pageY > position.top || event.pageY < (position.top + height)
		|| event.pageX > position.left
		|| event.pageX < (position.left + width)) {
			return true;
		}

		$('#resizearea').hide();
	},
	submit: function(model, response, prcChange, elementClass) {
		// Notify server
		var lastRealWidth = response.format.width;
		var newRealWidth = lastRealWidth + prcChange;
		response.format.width = newRealWidth;

		this.workspace.query.action.post("/FORMAT/ELEMENT/" + elementClass, {
			success: this.finished,
			data: response
		});

		return false;
	},
	finished: function(response) {
		this.workspace.query.run();
	},
});