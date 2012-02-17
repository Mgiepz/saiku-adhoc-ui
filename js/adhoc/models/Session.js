/*
 * Session.js
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
var Session = Backbone.Model.extend({

    initialize: function() {

        // Attach a custom event bus to this model
        _.extend(this, Backbone.Events);
        _.bindAll(this, "process_session","templates_callback", "prefetch_md_models");
        
        // Check expiration on localStorage
        if (! (localStorage.getItem('expiration') > (new Date()).getTime())) {
            localStorage.clear();
        }
        
        // Set expiration on localStorage to one day in the future
        var expires = (new Date()).getTime() + 
            Settings.LOCALSTORAGE_EXPIRATION;
        localStorage.setItem('expiration', expires);
        
        // Create session and fetch domains information
        // calls getDomains on DomainDiscoverResource
        // load additional templates
    	$.get('web/../js/templates/editor-templates.htm', this.templates_callback(this));
       
        return false;
    },
    
    templates_callback: function(session) {
    	return function(templates) {
			$('body').append(templates);
			session.fetch({ success: session.process_session });
		};		
	},
       
    error: function() {
        $(this.form.el).dialog('open');
    },
    

    process_session: function(mdModelInfo, response) {
  	
        // Save session in localStorage for other tabs to use
        if (localStorage && localStorage.getItem('session') === null) {
            localStorage.setItem('session', JSON.stringify(response));
        }

        // Generate model navigation for reuse
        this.model_navigation = _.template($("#template-models").html())({
            mdModelInfos: response
        });

        // Create domain objects
        this.mdModels = {};
        this.mdModelInfos = response;
        _.delay(this.prefetch_md_models, 200);
        
        // Show UI
        $(Application.toolbar.el).prependTo($("#header"));
        $("#header").show();
        Application.ui.unblock();
        
        // Add initial tab
        Application.tabs.render();
        Application.tabs.add(new Workspace());
        
        // Notify the rest of the application that login was successful
        Application.events.trigger('session:new', {
            session: this
        });

        var self = this;
        $.get(encodeURI(Settings.REST_URL) + '/discover/templates', function(templates){self.prpt_templates = templates;});
        $.get(encodeURI(Settings.REST_URL) + '/discover/pageformats', function(formats){self.page_formats = formats;});
        
    },
    
    prefetch_md_models: function() {
    	
        if (! this.mdModels) {
            Log.log(JSON.stringify({
                Message: "categories not initialized",
                Session: JSON.stringify(this)
            }));
            return;
        }
        
        for(var i = 0; i < this.mdModelInfos.length; i++) {
        	var mdModelInfo = this.mdModelInfos[i];
        	     	
        	//var key = encodeURIComponent(mdModelInfo.domainId)  + "/" + mdModelInfo.modelId;
        	var key = mdModelInfo.domainId  + "/" + mdModelInfo.modelId;
        	var path = key;
        	//alert("puttin " + key);
        	
        	//var path = encodeURIComponent(mdModelInfo.domainId) + "/" + mdModelInfo.modelId;

			if (localStorage && localStorage.getItem("md_model." + key) !== null){
				this.mdModels[key] = new MdModel(JSON.parse(localStorage.getItem("md_model." + key)));
			}else{
				this.mdModels[key] = new MdModel({ path: path, key: key });
                this.mdModels[key].fetch();	
			}
        }	
        
        // Start routing
        if (Backbone.history) {
            Backbone.history.start();
        }

    },
    
    url: function() {
    	var locale = (navigator.language || navigator.browserLanguage || 
        navigator.systemLanguage || navigator.userLanguage).substring(0,2).toLowerCase()
    	return encodeURI(Settings.REST_URL + "/discover/" + locale);
    	//return encodeURI(Settings.REST_URL + "/discover");
    }
});