var WorkspaceToolbar=Backbone.View.extend({enabled:false,events:{"click a":"call","change select":"changed"},initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"call","changed","reflect_properties","run_query","toggle_report","calculated_column");
this.workspace.bind("properties:loaded",this.reflect_properties);
this.workspace.trigger("workspace:toolbar:render",{workspace:this.workspace});
this.workspace.bind("query:new",this.activate_buttons);
this.workspace.bind("query:result",this.activate_buttons)
},activate_buttons:function(a){if(a.data&&a.data.length>0){$(a.workspace.toolbar.el).find(".button").removeClass("disabled_toolbar")
}else{$(a.workspace.toolbar.el).find(".button").addClass("disabled_toolbar");
$(a.workspace.toolbar.el).find(".auto,.formula,.toggle_fields,.toggle_sidebar, .export_xls, .export_pdf, .export_csv,.cda,.prpt, .report").removeClass("disabled_toolbar")
}},template:function(){return _.template($("#template-workspace-toolbar").html())()
},render:function(){$(this.el).html(this.template());
return this
},changed:function(b){var a=this;
this.workspace.query.action.get("/ROWLIMIT/"+$(b.target).val(),{success:function(){a.workspace.query.run(true)
}})
},call:function(a){var b=a.target.hash.replace("#","");
if(!$(a.target).hasClass("disabled_toolbar")&&this[b]){this[b](a)
}return false
},run_query:function(a){this.workspace.query.run(true)
},toggle_report:function(a){this.workspace.toggle_report()
},reflect_properties:function(){var a=this.workspace.query.properties?this.workspace.query.properties.properties:Settings.QUERY_PROPERTIES;
if(a["saiku.adhoc.query.automatic_execution"]==="true"){$(this.el).find(".auto").addClass("on")
}},save_query:function(a){if(this.workspace.query){(new SaveQuery({query:this.workspace.query})).render().open()
}},automatic_execution:function(a){this.workspace.query.properties.toggle("saiku.adhoc.query.automatic_execution").update();
$(a.target).toggleClass("on")
},toggle_fields:function(a){$(this.workspace.el).find(".workspace_fields").toggle()
},toggle_sidebar:function(){this.workspace.toggle_sidebar()
},setup_report:function(a){(new ReportSetupModal({workspace:this.workspace})).open()
},add_union:function(a){alert("Union Queries are not yet implemented, sorry!")
},add_join:function(a){alert("Joined Queries are not yet implemented, sorry!")
},calculated_column:function(a){(new ColumnConfigModal({index:-1,name:"calculated",key:"CATEGORY/CALCULATED/COLUMN/NEW",workspace:this.workspace})).open()
},export_xls:function(a){window.location=Settings.REST_URL+"/export/"+this.workspace.query.uuid+"/xls"
},export_csv:function(a){window.location=Settings.REST_URL+"/export/"+this.workspace.query.uuid+"/csv"
},export_pdf:function(a){window.location.href=Settings.REST_URL+"/export/"+this.workspace.query.uuid+"/pdf"
},export_cda:function(a){(new ExportFileModal({workspace:this.workspace,extension:"CDA"})).open()
},export_prpt:function(a){(new ExportFileModal({workspace:this.workspace,extension:"PRPT"})).open()
}});