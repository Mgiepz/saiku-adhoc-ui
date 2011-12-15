var ReportEditPanel=Backbone.View.extend({template:function(){return _.template($("#template-report-edit-panel").html())()
},initialize:function(a){this.workspace=a.workspace;
this.query=a.query
},render:function(){$(this.el).html(this.template());
return this
}});