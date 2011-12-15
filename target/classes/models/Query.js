var Query=Backbone.Model.extend({initialize:function(b,a){_.extend(this,a);
_.bindAll(this,"run","move_dimension","reflect_properties");
this.uuid="xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(f){var e=Math.random()*16|0,d=f=="x"?e:(e&3|8);
return d.toString(16)
}).toUpperCase();
this.reportPerspective=true;
this.action=new QueryAction({},{query:this});
this.result=new Result({},{query:this});
this.reportresult=new ReportResult({},{query:this});
this.inplace=new InplaceEdit({},{query:this})
},parse:function(a){if(!this.properties){this.properties=new Properties({},{query:this})
}else{this.properties.fetch({success:this.reflect_properties})
}},reflect_properties:function(){this.workspace.trigger("properties:loaded")
},run:function(a){if(!this.properties.properties["saiku.adhoc.query.automatic_execution"]&&!a){return
}Application.ui.block("Rendering Report");
if(this.reportPerspective){this.reportresult.fetch()
}else{this.result.fetch()
}},move_dimension:function(f,d,b){$(this.workspace.el).find(".run").removeClass("disabled_toolbar");
var e="";
if(d.hasClass("columns")){e="COLUMNS"
}if(d.hasClass("group")){e="GROUP"
}if(d.hasClass("filter")){e="FILTER"
}var b=d.find("li.ui-draggable").index(d.find('a[href="#'+f+'"]').parent());
var a="/"+e+"/"+f+"/POSITION/"+b;
var c=d.find('a[href="#'+f+'"]').parent().attr("id");
this.action.post(a,{data:{position:b,uid:c},success:function(){if(this.query.properties.properties["saiku.adhoc.query.automatic_execution"]==="true"&&e!="FILTER"){this.query.run()
}}})
},url:function(){return encodeURI(Settings.REST_URL+"/query/"+this.uuid)
}});