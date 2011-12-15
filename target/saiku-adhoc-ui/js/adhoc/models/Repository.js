/**
 * Repository query
 */
var SavedQuery = Backbone.Model.extend({
    parse: function(response, XHR) {
        this.json = response.json;
    },
    
    url: function() {   
        return encodeURI(Settings.REST_URL + "/repository/query/" + this.get('name'));
    },
    
    move_query_to_workspace: function(model, response) {
        var query = new Query({ 
            json: model.json
        }, {
            name: model.get('name')
        });
        
        var tab = Application.tabs.add(new Workspace({ query: query }));
    }
});

/**
 * Repository adapter
 */
var Repository = Backbone.Collection.extend({
    model: SavedQuery,
    
    initialize: function(args, options) {
        this.dialog = options.dialog;
    },
    
    parse: function(response) {
        this.dialog.populate(response);
    },
    
    url: function() {
        return encodeURI(Settings.REST_URL + "repository/query");
    }
});