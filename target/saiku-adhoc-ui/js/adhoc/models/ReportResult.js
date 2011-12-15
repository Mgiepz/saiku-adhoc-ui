/**
 * Holds the resultset for a query, and notifies plugins when resultset updated
 */
var ReportResult = Backbone.Model.extend({
    initialize: function(args, options) {
        // Keep reference to query
        this.query = options.query;
       
    },
    
    parse: function(response) {

	this.query.workspace.trigger('query:report', {
            workspace: this.query.workspace,
            data: response
        });
        
        // Show the UI if hidden
        Application.ui.unblock();
        
    },
    
    url: function() {
    	var template = this.query.template!=null ? this.query.template : "default";
    	var page = this.query.page!=null ? this.query.page : "1";
    	return encodeURI(this.query.url() + "/report/" + template + "/" + page);
    }
});