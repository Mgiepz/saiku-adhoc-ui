var ResultList=Backbone.Model.extend({parse:function(a){this.set({template:_.template($("#template-resultlist").html())({categories:respons}),data:a});
return a
}});