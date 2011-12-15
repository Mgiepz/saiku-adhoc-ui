var MdModel = Backbone.Model.extend({
    initialize: function(args) {
        this.url = encodeURI(Settings.REST_URL + "/discover/" + args.path + "/model");
    },
    
    parse: function(response) {

        this.set({
            template: _.template($("#template-md-model").html())({
                mdModel: response
            }),
            
            data: response
        });

        localStorage && localStorage.setItem("md_model." + this.get('key'),
                JSON.stringify(this));
                
        return response;
    }
});
