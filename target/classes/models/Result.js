var Result=Backbone.Model.extend({initialize:function(b,a){this.query=a.query
},parse:function(a){this.query.workspace.trigger("query:result",{workspace:this.query.workspace,data:a});
Application.ui.unblock()
},url:function(){return encodeURI(this.query.url()+"/result")
}});