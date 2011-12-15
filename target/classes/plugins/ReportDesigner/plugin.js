function(){alert("I am anonymous")
}var ReportDesigner=Backbone.View.extend({initialize:function(a){this.workspace=a.workspace;
this.id=_.uniqueId("report_");
$(this.el).attr({id:this.id});
_.bindAll(this,"render","receive_data","process_data","show","setOptions");
this.workspace.bind("query:result",this.receive_data);
this.add_button();
this.workspace.toolbar.report=this.show;
this.workspace.bind("workspace:adjust",this.render)
},add_button:function(){var b=$('<a href="#report" class="report button disabled_toolbar i18n" title="Report Designer"></a>').css({background:"url('js/adhoc/plugins/ReportDesigner/report.png') 50% 50% no-repeat"});
var a=$('<li class="seperator"></li>').append(b);
$(this.workspace.toolbar.el).find("ul").append(a)
},show:function(a,b){$(this.workspace.el).find(".workspace_results table").toggle();
$(this.el).toggle();
$(this.nav).toggle();
$(a.target).toggleClass("on");
if($(a.target).hasClass("on")){this.render()
}},setOptions:function(b){var a=$(b.target).attr("href").replace("#","");
try{this[a]()
}catch(c){}return false
},render:function(){},receive_data:function(a){return _.delay(this.process_data,0,a)
},process_data:function(a){}});
(function(){function b(d){d.workspace.report=new ReportDesigner({workspace:d.workspace});
alert("done")
}for(var a=0;
a<Application.tabs._tabs.length;
a++){var c=Application.tabs._tabs[a];
b({workspace:c.content})
}Application.session.bind("workspace:new",b)
})();