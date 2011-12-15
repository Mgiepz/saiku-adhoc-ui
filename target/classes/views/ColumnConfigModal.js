var ColumnConfigModal=Modal.extend({type:"columnconfig",buttons:[{text:"Save",method:"save"},{text:"Cancel",method:"close"}],events:{"click a":"call"},changed:function(a){var b=$(a.currentTarget)
},initialize:function(b){_.extend(this,b);
this.options.title="Setup Column "+this.name;
this.message="Fetching config...";
this.show_unique=false;
this.query=b.workspace.query;
_.bindAll(this,"fetch_values","populate","finished","changed","add_calculated_column");
this.bind("open",this.post_render);
this.render();
this.category=b.key.split("/")[1];
this.column=b.key.split("/")[3];
this.index=b.index;
if(!(this.category=="CALCULATED"&&this.column=="NEW")){this.fetch_values()
}else{var a=defaultCalcColumn;
this.json=$.extend(true,{},defaultCalcColumn);
this.populate()
}},fetch_values:function(b,a){this.workspace.query.action.get("/COLUMNS/CATEGORY/"+this.category+"/COLUMN/"+this.column+"/POSITION/"+this.index+"/config",{success:this.populate})
},populate:function(c,a){var d=_.template($("#template-column-setup").html())(this);
if(a!=null){this.json=a
}$(this.el).find(".dialog_body").html(d);
$(this.el).find("#description").html(this.json.description);
if(this.category=="CALCULATED"){$(this.el).find("#formula").removeClass("hide").find(".formula").val(this.json.formula)
}$(this.el).find("#displayname input").val(this.json.name);
$(this.el).find("#format input").val(this.json.formatMask);
if(this.json.fieldType=="Numeric"||this.json.fieldType=="Date"){$(this.el).find("#format input").removeAttr("disabled")
}if(this.json.aggTypes!=null){for(var b=0;
b<this.json.aggTypes.length;
b++){var e=this.json.aggTypes[b];
$("<option />").text(AggTypes[e]).val(e).appendTo($(this.el).find("#aggregation select"))
}}$(this.el).find("#aggregation select").val(this.json.selectedAggType);
for(var e in AggTypes){$("<option />").text(AggTypes[e]).val(e).appendTo($(this.el).find("#summary select"))
}$(this.el).find("#summary select").val(this.json.selectedSummaryType);
Application.ui.unblock()
},post_render:function(a){$(a.modal.el).parents(".ui-dialog").css({width:"200px"})
},save:function(){this.json.name=$(this.el).find("#displayname input").val();
this.json.formatMask=$(this.el).find("#format input").val();
if(!$(this.el).find("#formula").hasClass("hide")){this.json.formula=$(this.el).find("#formula .formula").val()
}this.json.selectedAggType=$(this.el).find("#aggregation select").val();
this.json.selectedSummaryType=$(this.el).find("#summary select").val();
this.json.hideRepeating=$(this.el).find("#show_unique").is(":checked");
if(this.json.uid==null){this.json.uid=this.workspace.uniqueId("rpt-dtl-")
}var a=$("<div>Saving...</div>");
$(this.el).find(".dialog_body").children().hide();
$(this.el).find(".dialog_body").prepend(a);
this.query.action.post("/COLUMNS/CATEGORY/"+this.category+"/COLUMN/"+this.column+"/POSITION/"+this.index+"/config",{success:this.finished,data:this.json});
return false
},add_calculated_column:function(){var a=$(this.workspace.el).find(".columns ul");
var b=$(".category_tree").find('a[title="calc_column"]').parent();
var c=b.clone().addClass("d_measure").addClass(".calculated").attr("id",this.json.uid).removeClass("hide");
c.find('a[title="calc_column"]').attr("title",this.json.name).html(this.json.name).attr("href","abc");
c.appendTo(a)
},finished:function(){if(this.category=="CALCULATED"&&this.column=="NEW"){this.add_calculated_column()
}$(this.el).dialog("destroy").remove();
this.query.run()
}});