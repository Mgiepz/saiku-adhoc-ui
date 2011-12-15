var FileTree=Backbone.Model.extend({initialize:function(a){this.url=encodeURI(Settings.REST_URL+"/repository/browse/"+a.dir+"/"+a.extensions)
},parse:function(a){this.set({template:_.template($("#template-filetree").html())({tree:a}),data:a});
return a
}});