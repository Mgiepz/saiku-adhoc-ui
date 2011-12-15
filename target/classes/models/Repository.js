var SavedQuery=Backbone.Model.extend({parse:function(a,b){this.json=a.json
},url:function(){return encodeURI(Settings.REST_URL+"/repository/query/"+this.get("name"))
},move_query_to_workspace:function(b,a){var d=new Query({json:b.json},{name:b.get("name")});
var c=Application.tabs.add(new Workspace({query:d}))
}});
var Repository=Backbone.Collection.extend({model:SavedQuery,initialize:function(b,a){this.dialog=a.dialog
},parse:function(a){this.dialog.populate(a)
},url:function(){return encodeURI(Settings.REST_URL+"repository/query")
}});