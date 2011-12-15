var Workspace=Backbone.View.extend({className:"tab_container",events:{"click .sidebar_separator":"toggle_sidebar","change .mdModels":"new_query",drop:"remove_concept"},initialize:function(a){_.bindAll(this,"adjust","toggle_sidebar","prepare","new_query","init_query","update_caption","populate_selections","uniqueId");
_.extend(this,Backbone.Events);
this.loaded=false;
this.toolbar=new WorkspaceToolbar({workspace:this});
this.toolbar.render();
this.drop_zones=new WorkspaceDropZone({workspace:this});
this.drop_zones.render();
this.table=new Table({workspace:this});
this.report=new Report({workspace:this});
if(a&&a.query){this.query=a.query;
this.query.workspace=this;
this.query.save({},{success:this.init_query})
}this.idCounter=0;
Application.session.bind("tab:add",this.prepare)
},adjust:function(){$separator=$(this.el).find(".sidebar_separator");
$separator.height($("body").height()-87);
$(this.el).find(".sidebar").height($("body").height()-87);
$(this.el).find(".workspace_results").css({width:$(document).width()-$(this.el).find(".sidebar").width()-30,height:$(document).height()-$("#header").height()-$(this.el).find(".workspace_toolbar").height()-$(this.el).find(".workspace_fields").height()-40})
},caption:function(){if(this.query&&this.query.name){return this.query.name
}return"Unsaved query ("+(Application.tabs.queryCount+1)+")"
},template:function(){return _.template($("#template-workspace").html())({model_navigation:Application.session.model_navigation})
},render:function(){$(this.el).html(this.template());
$(this.el).find(".workspace_toolbar").append($(this.toolbar.el));
$(this.drop_zones.el).insertAfter($(this.el).find(".workspace_toolbar"));
$(this.el).find(".sidebar").droppable({accept:".d_measure, .d_dimension"});
$(this.el).find(".workspace_results").append($(this.table.el));
$(this.el).find(".workspace_report_canvas").append($(this.report.el));
if(Settings.START_WITH_REPORT){$(this.el).find(".workspace_results").hide();
$(this.el).find(".workspace_report").show();
$(".workspace_toolbar .view").addClass("table")
}else{$(this.el).find(".workspace_results").show();
$(this.el).find(".workspace_report").hide()
}this.edit_panel=new ElementFormatPanel({workspace:this,el:$(this.el).find("#edit_panel")});
this.edit_panel.render();
this.tab.bind("tab:select",this.adjust);
$(window).resize(this.adjust);
Application.session.trigger("workspace:new",{workspace:this});
return this
},clear:function(){$(this.el).find(".workspace_results table,.connectable").html("");
this.trigger("workspace:clear")
},adjust:function(){$separator=$(this.el).find(".sidebar_separator");
$separator.height($("body").height()-87);
$(this.el).find(".sidebar").height($("body").height()-87)
},toggle_sidebar:function(){$(this.el).find(".sidebar").toggleClass("hide");
$(this.toolbar.el).find(".toggle_sidebar").toggleClass("on");
var a=$(this.el).find(".sidebar").hasClass("hide")?5:265;
$(this.el).find(".workspace_inner").css({"margin-left":a})
},toggle_report:function(){this.query.reportPerspective=this.query.reportPerspective?false:true;
$(".workspace_toolbar .view").toggleClass("table");
$(this.el).find(".workspace_results").toggle();
$(this.el).find(".workspace_report").toggle()
},prepare:function(){$(this.el).find(".mdModels").parent().animate({backgroundColor:"#AC1614"},"fast").animate({backgroundColor:"#fff"},"fast")
},new_query:function(){if(this.query){this.query.destroy()
}this.selected_model=$(this.el).find(".mdModels").val();
var b=this.selected_model;
var a=this.selected_model.split("/");
this.query=new Query({domainId:a[0],modelId:a[1]},{workspace:this});
this.query.save();
this.init_query()
},init_query:function(){if(this.query.get("json")){var a=JSON.parse(this.query.get("json"));
this.selected_model=a.clientModelSelection
}if(this.selected_model===undefined){this.selected_model=this.query.get("model")
}$(this.el).find(".mdModels").val(this.selected_model);
this.clear();
if(this.selected_model){this.mdmodel_list=new MdModelList({workspace:this,mdModel:Application.session.mdModels[this.selected_model]});
$(this.el).find(".category_tree").html("").append($(this.mdmodel_list.el))
}else{$(this.el).find(".category_tree").html("");
return
}$(this.el).find(".workspace_results").show();
$(this.el).find(".workspace_report").hide();
this.populate_selections()
},populate_selections:function(){if(this.query.get("json")){var g=JSON.parse(this.query.get("json"))
}if(g){var e=g.columns?g.columns:false;
var c=g.groups?g.groups:false;
var p=g.parameters?g.parameters:false;
if(e){var m=$(this.el).find(".columns ul");
for(var h=0;
h<e.length;
h++){var d=e[h];
var a=d.name;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(m)
}}if(c){var l=$(this.el).find(".group ul");
for(var f=0;
f<c.length;
f++){var o=c[f];
var a=o.groupName;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(l)
}}if(p){var j=$(this.el).find(".filter ul");
for(var n=0;
n<p.length;
n++){var b=p[n];
var a=b.name;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(j)
}}this.query.run();
this.trigger("query:new",{workspace:this});
this.query.bind("query:save",this.update_caption)
}},update_caption:function(){var a=this.query.get("name");
$(this.tab.el).find("a").html(a)
},remove_concept:function(a,b){this.drop_zones.remove_dimension(a,b)
},uniqueId:function(a){var b=this.idCounter++;
return a?a+b:b
}});