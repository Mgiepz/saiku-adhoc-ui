/**
 * Model which fetches the categories for a domain
 */
var ResultList = Backbone.Model.extend({

    parse: function(response) {
        this.set({
            template: _.template($("#template-resultlist").html())({
                categories: respons
            }),
            
            data: response
        });

        return response;
    }
});