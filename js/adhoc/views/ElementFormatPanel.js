/*
 * ElementFormatPanel.js
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
/*
 * The report format editor
 */
var ElementFormatPanel = Backbone.View.extend({

	id: "format",

	events: {
		'click a': 'call',
		'change .sizeSelector select' : 'size_select'
	},

	initialize: function(args) {

		this.workspace = args.workspace;

		this.query = args.workspace.query;

		this.workspace.bind('query:report', this.enable_template_button);

		_.extend(this, args);
		_.extend(this, Backbone.Events);

		_.bindAll(this, "render","reflect_formatting","fetch_values","save","call", "disable_buttons", "enable_buttons",
				"align_left","align_center","align_right","textcolor_callback","size_select","enable_template_button"			
		);

	},

	template: function() {
		return _.template($("#format-editor").html())();
	},

	textcolor_callback: function(panel) {
		return function (hsb, hex, rgb){
			panel.json.format.fontColor = '#' + hex;
			panel.save(panel.json);
		}
	},

	bgcolor_callback: function(panel) {
		return function (hsb, hex, rgb){
			panel.json.format.backgroundColor = '#' + hex;
			panel.save(panel.json);
		}
	},

	font_callback: function(panel) {
		return function(event){
			panel.json.format.fontName = $(event.target).val();
			panel.save(panel.json);
		}
	},

	size_select: function(event){
		this.json.format.fontSize = $(event.target).val();
		this.save(this.json);
	},

	render: function() {

		$(this.el).html(this.template());

		this.oFontpicker = $(this.el).find('.fontPicker').fontPicker({bgColor: '#ffffee'});

		$(this.el).find('#fontPickerInput').change(this.font_callback(this));

		$(this.el).find('.text-color').ColorPicker({
			color: '#0000ff',
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onSubmit: this.textcolor_callback(this)
		});

		$(this.el).find('.background-color').ColorPicker({
			color: '#0000ff',
			onShow: function (colpkr) {
				$(colpkr).fadeIn(500);
				return false;
			},
			onHide: function (colpkr) {
				$(colpkr).fadeOut(500);
				return false;
			},
			onSubmit: this.bgcolor_callback(this)
		});

//		TODO: move to a template
		var $fontSize = $(this.el).find('.sizeSelector')
		.append('&nbsp;<select> \
				<option value="6">6</option> \
				<option value="8">8</option> \
				<option value="9">9</option> \
				<option value="10">10</option> \
				<option value="11">11</option> \
				<option value="12">12</option> \
				<option value="13">13</option> \
				<option value="14">14</option> \
				<option value="15">15</option> \
				<option value="16">16</option> \
				<option value="17">17</option> \
				<option value="18">18</option> \
				<option value="20">20</option> \
				<option value="22">22</option> \
				<option value="24">24</option> \
				<option value="28">28</option> \
				<option value="32">32</option> \
		</select>');

		this.disable_buttons();

		return this;
	},
	
	disable_buttons: function(){
		$(this.el).find('.button').not('.templates').removeClass('on').addClass('disabled_editor');
		$(this.el).find('select').attr('disabled', 'disabled');
		$(this.el).find('.fontPicker').fontPicker('option', 'disabled', true);
	},


	enable_template_button: function(){
		$(this.el).find('.button.templates').removeClass('disabled_editor');
	},

	enable_buttons: function(){
		$(this.el).find('.fontPicker').fontPicker('option', 'disabled', false);
		$(this.el).find('select').removeAttr('disabled');
		$(this.el).find('.button').removeClass('disabled_editor');		
	},


	reflect_formatting: function(model, response) {

		this.json = response;
		var format = this.json.format;
		
		
		//if we get a uid in the response we have to set the name
		if(this.json.uid) $('li#' +this.json.uid ).find('.dimension').html(this.json.value);

		this.enable_buttons();

		var horzAlignment = format.horizontalAlignment.toLowerCase();
		$(this.el).find('.horz.align-' + horzAlignment).addClass('on');

		var vertAlignment = format.verticalAlignment.toLowerCase();
		$(this.el).find('.vert.align-' + vertAlignment).addClass('on');

		$(this.el).find('.sizeSelector select').val(format.fontSize);

		//this.oFontpicker.fontFamily(format.fontName);
		$(this.el).find('.fontPicker').fontPicker('option', 'defaultFont', format.fontName);
		//$(this.el).find('.fontPicker').fontFamily(format.fontName);

		if(format.fontBold){
			$(this.el).find('.fontstyle-bold').addClass('on');
		}
		if(format.fontItalic){
			$(this.el).find('.fontstyle-italic').addClass('on');
		}
		if(format.fontUnderlined){
			$(this.el).find('.fontstyle-udl').addClass('on');
		}

		var that = this;

		var inplaceEditDelegate = {
				willOpenEditInPlace: function(aDOMNode, aSettingsDict) {
					return that.json.value;
				}
		};

		$('.report_inner').one('click', function(evt) {
    		if (evt.target == this) {
        		$('.saiku').removeClass('adhoc-highlight').removeClass('report-hover');		
        		$(this).find('#dragzone').fadeOut('slow').remove();
        		that.disable_buttons();	
    		}
		});
		
		/*
		 * Inplace edit for column headers
		 */		
		$('.adhoc-highlight').each(function(){
			//Details should not be click-editable
			if(!($(this).attr('class').indexOf('rpt-dtl') > -1)){
				$(this).editInPlace({
					preinit: function(){
						if(that.isEditing) return false;
						that.isEditing = true;
					},
					callback: function(unused, enteredText) {
						//save the value to the server
						var model = $.extend(true, {}, emptyFormat);
						model.value = enteredText;
						
						that.isEditing=false;
						//that.json.value = enteredText;
						that.save(model);
						return true;
					},
					delegate: inplaceEditDelegate,
					//show_buttons: true,
					//save_button: '<button class="inplace_save"><img src="images/src/accept.png"></button>',
					//cancel_button: '',		
					default_text: function(){return that.json.value;},
					select_text: function(){return that.json.value;},
					save_if_nothing_changed: true,
					select_options: "selected:disabled"
				});


				}

				}
		
		);

	},

	fetch_values: function(element, type) {

		if(this.isEditing) return false;

		this.element = element;

		this.workspace.query.action.get("/FORMAT/ELEMENT/" + element , {
			success: this.reflect_formatting
		});
		
	},

	save: function(model) {
		// Notify server

		//TODO: This is a dirty hack
		model.format.width = null;
		
		this.workspace.query.action.post("/FORMAT/ELEMENT/" + this.element, {
			success: this.finished,
			data: model
		});

		return false;
	},
	
	finished: function(response) {	
		if(response) $('li#' + response.uid ).find('.dimension').html(response.displayName); 
		this.query.run();
	},

	call: function(event) {
		//Determine callback
		var callback = event.target.hash.replace('#', '');

		//Attempt to call callback
		if (! $(event.target).hasClass('disabled_editor') && this[callback]) {
			this[callback](event);
		}

		return false;
	},

	select_templates: function(event) {
		 (new TemplatesModal({
            workspace: this.workspace
        })).open();
	},

	padding_inc: function(event) {

		this.json.format.paddingLeft += 5;
		this.json.format.paddingRight += 5;
		this.save(this.json);
	},

	padding_dec: function(event) {
		this.json.format.paddingLeft -= 5;
		this.json.format.paddingRight -= 5;
		if(this.json.format.paddingLeft < 0) {
			this.json.format.paddingLeft = 0;
		} 
		if(this.json.format.paddingRight < 0) {
			this.json.format.paddingRight = 0;
		} 
		this.save(this.json);
	},

	align_left: function(event) {
		this.json.format.horizontalAlignment = "LEFT";
		this.save(this.json);
	},

	align_center: function(event) {
		this.json.format.horizontalAlignment = "CENTER";
		this.save(this.json);
	},

	align_right: function(event) {
		this.json.format.horizontalAlignment = "RIGHT";
		this.save(this.json);
	},

	align_top: function(event) {
		this.json.format.verticalAlignment = "TOP";
		this.save(this.json);
	},

	align_middle: function(event) {
		this.json.format.verticalAlignment = "MIDDLE";
		this.save(this.json);
	},

	align_bottom: function(event) {
		this.json.format.verticalAlignment = "BOTTOM";
		this.save(this.json);
	},

	fontstyle_bold: function(event) {
		
		var model = $.extend(true, {}, emptyFormat);
		model.value=this.json.value;

		$(this.el).find('.fontstyle-bold').toggleClass('on');

		if($(this.el).find('.fontstyle-bold').hasClass('on')){
			model.format.fontBold = true;
		}else{
			model.format.fontBold = false;
		}
		this.save(model);
	},

	fontstyle_italic: function(event) {
		
		var model = $.extend(true, {}, emptyFormat);
		model.value=this.json.value;

		$(this.el).find('.fontstyle-italic').toggleClass('on');

		if($(this.el).find('.fontstyle-italic').hasClass('on')){
			model.format.fontItalic = true;
		}else{
			model.format.fontItalic= false;
		}
		this.save(model);
	},

	fontstyle_udl: function(event) {
		
		var model = $.extend(true, {}, emptyFormat);
		model.value=this.json.value;

		$(this.el).find('.fontstyle-udl').toggleClass('on');

		if($(this.el).find('.fontstyle-udl').hasClass('on')){
			model.format.fontUnderlined = true;
		}else{
			model.format.fontUnderlined = false;
		}
		this.save(model);
	}
	
});
