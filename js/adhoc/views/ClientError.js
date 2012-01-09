var ClientError = Backbone.View.extend({
    className: "client_error",
    
    initialize: function(args) {
        this.query = args.query;
        this.message = args.message;

        _.bindAll(this, "render");
       
    },
    
    template: function() {
       //return _.template($("#client-error").html())();
    },

    render: function() {
    	$(this.el).html('<tr><td>' + this.message + '</td></tr>');
    }
    
});