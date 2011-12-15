var SelectionsModal=Modal.extend({type:"selections",buttons:[{text:"Save",method:"save"},{text:"Cancel",method:"close"}],events:{"click a":"call","change #show_unique":"show_unique"},initialize:function(a){_.extend(this,a);
this.options.title="Filter on "+this.name;
this.message="Fetching values...";
this.show_unique=false;
this.query=a.workspace.query;
_.bindAll(this,"fetch_values","populate","finished");
_.extend(this.events,{"click div.selection_buttons a.form_button":"move_selection"});
this.bind("open",this.post_render);
this.render();
this.category=a.key.split("/")[1];
this.column=a.key.split("/")[3];
this.fetch_values()
},fetch_values:function(b,a){this.workspace.query.action.get("/FILTER/CATEGORY/"+this.category+"/COLUMN/"+this.column+"/result",{success:this.populate})
},populate:function(b,a){if(a.dataType=="Date"){this.populate_datefilter(b,a)
}else{this.populate_multiselect(b,a)
}Application.ui.unblock()
},populate_datefilter:function(b,a){var c=_.template($("#template-datefilter").html())(this);
$(this.el).find(".dialog_body").html(c);
$(this.el).find(".datepicker_from").datepicker({dateFormat:"dd.mm.yy",changeMonth:true,changeYear:true,onSelect:function(e,d){}});
$(this.el).find(".datepicker_to").datepicker({dateFormat:"dd.mm.yy",changeMonth:true,changeYear:true,onSelect:function(e,d){}})
},populate_multiselect:function(c,a){try{var f=_.template($("#template-selections").html())(this);
$(this.el).find(".dialog_body").html(f);
this.available_values=JSON.parse(a.availableValues).resultset;
this.selected_values=a.selectedValues;
var k=[];
if(this.selected_values!=null){$(this.el).find(".used_selections select").removeAttr("disabled");
for(var b=0;
b<this.selected_values.length;
b++){var g=this.selected_values[b];
$("<option />").text(g).val(g).appendTo($(this.el).find(".used_selections select"));
k.push(g)
}}this.available_values=_.select(this.available_values,function(e){return k.indexOf(e[0])===-1
});
$(this.el).find(".available_selections select").removeAttr("disabled");
for(var d=0;
d<this.available_values.length;
d++){var g=this.available_values[d];
if(g[0]!=null){$("<option />").text(g[0]).val(g[0]).appendTo($(this.el).find(".available_selections select"))
}}}catch(h){$(this.el).html("Could not load selections")
}},post_render:function(a){$(a.modal.el).parents(".ui-dialog").css({width:"500px"})
},move_selection:function(c){var d=$(c.target).attr("id");
var e=d.indexOf("add")!==-1?$(this.el).find(".used_selections select"):$(this.el).find(".available_selections select");
var b=d.indexOf("add")!==-1?$(this.el).find(".available_selections select"):$(this.el).find(".used_selections select");
var a=d.indexOf("all")!==-1?b.find("option"):b.find("option:selected");
a.detach().appendTo(e)
},show_unique:function(){$.each($(this.el).find("option"),function(a,b){var c=$(b).text();
$(b).text($(b).val());
$(b).val(c)
});
this.show_unique=!this.show_unique
},save:function(){var d=$("<div>Saving...</div>");
$(this.el).find(".dialog_body").children().hide();
$(this.el).find(".dialog_body").prepend(d);
var b=[];
if($(this.el).find(".selection_buttons").length==0){var a=$(this.el).find(".datepicker_from").val();
b.push({value:a});
var c=$(this.el).find(".datepicker_to").val();
b.push({value:c})
}else{$(this.el).find(".used_selections option").each(function(e,f){var g=$(f).text();
b.push({value:g})
})
}this.query.action.post("/FILTER/CATEGORY/"+this.category+"/COLUMN/"+this.column+"/VALUES",{success:this.finished,data:b});
return false
},finished:function(){$(this.el).dialog("destroy").remove();
this.query.run()
}});