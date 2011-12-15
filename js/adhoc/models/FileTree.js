/**
 * Model which fetches the metadata models for a domain/model-info
 */
var FileTree = Backbone.Model.extend({
    initialize: function(args) {
        this.url = encodeURI(Settings.REST_URL + "/repository/browse/" + args.dir + "/" + args.extensions);
    },
    
    parse: function(response) {

        this.set({
            template: _.template($("#template-filetree").html())({
                tree: response
            }),        
            data: response
        });

        return response;
    }
});
