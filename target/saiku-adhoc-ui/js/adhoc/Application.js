/**
 * Central object for handling global application state
 */
var Application = {
    /**
     * View which manages toolbar interactions
     */
    toolbar: {},
    
     /**
     * View which handles tabs
     */
    tabs: new TabSet(),

    /**
     * Model which handles session
     */
    session: null,
    
    /**
     * Global event bus
     */
    events: _.extend({}, Backbone.Events),
    
     /**
     * Collection of routers for page fragments
     */
    routers: [],
    
    
    /**
     * Convenience functions for blocking the UI
     */
    ui: {
        block: function(message) {
            $('.processing,.processing_container').fadeIn();
            $('.processing_message').text(message);
        },
        
        unblock: function() {
            $('.processing,.processing_container').fadeOut();
        }
    }
};

/**
 * Setting this option to true will fake PUT and DELETE requests 
 * with a HTTP POST, and pass them under the _method parameter. 
 * Setting this option will also set an X-HTTP-Method-Override header 
 * with the true method. This is required for BI server integration
 */
Backbone.emulateHTTP = true;

/**
 * Up up and away!

$(document).ready(function() {
    Application.session = new Session();
});
*/
 
