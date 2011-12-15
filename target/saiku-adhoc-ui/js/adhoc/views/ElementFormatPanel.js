/**
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
    	
        _.extend(this, args);
        _.extend(this, Backbone.Events);
        
        _.bindAll(this, "render","reflect_formatting","fetch_values","save","call",
        "align_left","align_center","align_right","textcolor_callback","size_select"
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
	
	disable: function(){
	    $(this.el).addClass('disabled_editor');
	    $(this.el).find('select').attr('disabled',true);
	},
    
    render: function() {

    	$(this.el).html(this.template());
    	
    	$(this.el).addClass('disabled_editor');
    	
   	    $(this.el).find('.fontPicker').fontPicker();
   	    
   	    $(this.el).find('#fontPickerInput').change(
   	    	this.font_callback(this)
   	    )

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

		//TODO: move to a template
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
		  
    	
        return this; 
    },

    reflect_formatting: function(model, response) {
    	
    
    	this.json = response;
    	var format = this.json.format;

		//reset elements
    	$(this.el).removeClass('disabled_editor');
    	$(this.el).find('select').removeAttr('disabled');	
		$(this.el).find('.horz').removeClass('on');
		$(this.el).find('.vert').removeClass('on');


		var horzAlignment = format.horizontalAlignment.toLowerCase();
		$(this.el).find('.horz.align-' + horzAlignment).addClass('on');

		var vertAlignment = format.verticalAlignment.toLowerCase();
		$(this.el).find('.vert.align-' + vertAlignment).addClass('on');

		$(this.el).find('.sizeSelector select').val(format.fontSize);
		
		$(this.el).find('#fontPickerInput').val(format.fontName);
		
		//format.fontSize;
		//format.fontName;

		var that = this;
		
		var inplaceEditDelegate = {
			willOpenEditInPlace: function(aDOMNode, aSettingsDict) {
				return that.json.value;
			}
		};

    	$('.adhoc-highlight').each(function(){
    		//Details should not be click-editable
    		if(!($(this).attr('class').indexOf('rpt-dtl') > -1)){ 		
    			$(this).editInPlace({
    				callback: function(unused, enteredText) { 
    					//save the value to the server
    					that.json.value = enteredText;
    					that.save(that.json);
    					return true;
    				},
					delegate: inplaceEditDelegate,
    				show_buttons: true,
    		 		default_text: function(){return that.json.value;},
    				select_text: function(){return that.json.value;},
    				select_options: "selected:disabled"
    			});    
    		}	
    	});
    	
    	
    	//we need to create a new json and only send back the 
    	
    },
    
    fetch_values: function(element, type) {
 	
 		//fetch from different url depending on type
 		this.element = element;
 	
        this.workspace.query.action.get("/FORMAT/ELEMENT/" + element , { 
            success: this.reflect_formatting
        });
    },

    save: function(model) {      
        	// Notify server
        this.workspace.query.action.post("/FORMAT/ELEMENT/" + this.element, { 
            success: this.finished,
            data: model
        });
        
        return false;
    },
    
    finished: function() {
        this.query.run();
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
    }
    
});