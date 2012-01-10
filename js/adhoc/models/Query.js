/**
 * Workspace query
 */
var Query = Backbone.Model.extend({
    initialize: function(args, options) {
    	
    	_.extend(this, options);
        
        // Bind `this`
        _.bindAll(this, "run", "move_dimension", "reflect_properties");
        
        // Generate a unique query id
        this.uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
            function (c) {
                var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
            
            
        this.reportPerspective = true;
        
        this.action = new QueryAction({}, { query: this });
        this.result = new Result({}, { query: this });

        this.reportresult = new ReportResult({}, { query: this });
        this.inplace = new InplaceEdit({}, { query: this });

    },
    
    parse: function(response) {

    	 // Fetch initial properties from server
        if (! this.properties) {
            this.properties = new Properties({}, { query: this });
        } else {
            this.properties.fetch({
                success: this.reflect_properties
            });
        }
       
    },
    
    reflect_properties: function() {
        this.workspace.trigger('properties:loaded');
    },

    run: function(force) {
    	
        if (! this.properties.properties['saiku.adhoc.query.automatic_execution'] &&
            ! force) {
            return;
        }

		Application.ui.block("Rendering Report");

		var self = this;

		if(!this.reportPerspective){
			this.result.fetch( {error: 
				function(model, response){
					self.error = new ClientError({ query: self, message: response.responseText, el: $('.error')});
					self.workspace.reset_canvas();
					self.error.render();					
					Application.ui.unblock();
				}});
		}else{
			this.reportresult.fetch( {error: 
				function(model, response){
					self.error = new ClientError({ query: self, message: response.responseText, el: $('.report_inner')});
					self.workspace.reset_canvas();
					self.error.render();
					Application.ui.unblock();
				}});
		}

   },
    
    move_dimension: function(dimension, $target_el, index) {
        $(this.workspace.el).find('.run').removeClass('disabled_toolbar');
        
        var target = '';
        if ($target_el.hasClass('columns')) target = "COLUMNS";
        if ($target_el.hasClass('group')) target = "GROUP";
        if ($target_el.hasClass('filter')) target = "FILTER";

        var index = $target_el.find('li.ui-draggable').index(
                $target_el.find('a[href="#' + dimension + '"]').parent() );
        
        var url = "/" + target + "/" + dimension + "/POSITION/" + index;

       // var $element = $target_el.find('li.ui-draggable');
        
        var uid = $target_el.find('a[href="#' + dimension + '"]').parent().attr('id');
        
        this.action.post(url, {
        	data: {
                position: index,
                uid: uid
            },
            success: function() {
            		 if (this.query.properties
                    .properties['saiku.adhoc.query.automatic_execution'] === 'true' && target != 'FILTER') {
                    this.query.run();
                }
            }
        });
    },
    
    url: function() {
        return encodeURI(Settings.REST_URL + "/query/" + this.uuid);
    }
});
