var Report=Backbone.View.extend({className:"report_inner",initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"render","process_data","show_editor","prevPage","nextPage","firstPage","lastPage");
this.workspace.bind("query:report",this.render);
this.workspace.bind("report:edit",this.show_editor)
},template:function(){return _.template($("#navigator").html())()
},show_editor:function(a){var c=a.id.split("-");
var b=c[2]+"-"+c[3]+"-"+c[4];
this.workspace.query.lastEditElement=a.id;
this.workspace.edit_panel.fetch_values(a.id,a.type)
},render:function(a){_.delay(this.process_data,0,a)
},process_data:function(b){this.json=b.data;
var a=b.data.data;
$(this.el).empty();
$(this.el).html(a).wrapInner('<div class="report_border" />');
$(".report_border").width($(".report_border table").width()+30);
$(this.el).prepend(this.template());
$(".report-navigator").width($(".report_border").width());
$(".report-navigator #curr_page").html(b.data.currentPage+1);
$(".report-navigator #off_page").html(b.data.pageCount).click();
$(".report-navigator #prev").click(this.prevPage);
$(".report-navigator #next").click(this.nextPage);
$(".report-navigator #first").click(this.firstPage);
$(".report-navigator #last").click(this.lastPage);
this.template_select=new SetupTemplate({workspace:this.workspace});
this.workspace.query.trigger("report:render",{workspace:this.workspace,report:this})
},prevPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var b=a>1?a-1:1;
this.workspace.query.page=b;
this.workspace.query.run(true)
},nextPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var d=this.json.pageCount;
var b=a<d?a+1:d;
this.workspace.query.page=b;
this.workspace.query.run(true)
},firstPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var b=1;
this.workspace.query.page=b;
this.workspace.query.run(true)
},lastPage:function(b){var c=this.json.pageCount;
var a=c;
this.workspace.query.page=a;
this.workspace.query.run(true)
},no_results:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>No Report</td></tr>")
},error:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>"+a.data[0][0].value+"</td></tr>")
}});