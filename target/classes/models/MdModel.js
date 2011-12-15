var MdModel=Backbone.Model.extend({initialize:function(a){this.url=encodeURI(Settings.REST_URL+"/discover/"+a.path+"/model")
},parse:function(a){this.set({template:_.template($("#template-md-model").html())({mdModel:a}),data:a});
localStorage&&localStorage.setItem("md_model."+this.get("key"),JSON.stringify(this));
return a
}});