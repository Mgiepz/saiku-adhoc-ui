var ReportResult=Backbone.Model.extend({initialize:function(b,a){this.query=a.query
},parse:function(a){this.query.workspace.trigger("query:report",{workspace:this.query.workspace,data:a});
Application.ui.unblock()
},url:function(){var a=this.query.template!=null?this.query.template:"default";
var b=this.query.page!=null?this.query.page:"1";
return encodeURI(this.query.url()+"/report/"+a+"/"+b)
}});