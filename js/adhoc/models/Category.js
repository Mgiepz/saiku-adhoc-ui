/**
 * Model which fetches the categories for a domain

var Category = Backbone.Model.extend({
    initialize: function(args) {
        this.url = "discover/" +
            args.key + "/categories";
    },
    
    parse: function(response) {
        this.set({
            template: _.template($("#template-categories").html())({
                categories: response
            }),
            
            data: response
        });
        
        localStorage && localStorage.setItem("categories." + this.get('key'),
                JSON.stringify(this));
        
        return response;
    }
});
 */

/**
 * Model which fetches the columns for a category

var Column = Backbone.Model.extend({
    initialize: function(args) {
        this.url = "discover/" +
            args.key + "/columns";
    },
    
    parse: function(response) {
        this.set({ 
            template: _.template($("#template-columns").html())({
                columns: response
            }),
            
            data: response
        });
        
        localStorage && localStorage.setItem("column." + this.get('key'),
                JSON.stringify(this));
        
        return response;
    }
});
 */