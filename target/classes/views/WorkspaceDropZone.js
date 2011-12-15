var WorkspaceDropZone=Backbone.View.extend({template:function(){return _.template($("#template-workspace-dropzones").html())()
},events:{sortstop:"select_dimension","click a":"selections","click span.sort":"sort"},initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"select_dimension","move_dimension","remove_dimension","sort")
},render:function(){$(this.el).html(this.template());
$(this.el).find(".connectable").sortable({connectWith:$(this.el).find(".connectable"),cursorAt:{top:10,left:35},forcePlaceholderSize:true,items:"> li",opacity:0.6,placeholder:"placeholder",tolerance:"pointer"});
return this
},select_dimension:function(d,e){if(e.item.hasClass("d_measure")||e.item.hasClass("d_dimension")){this.move_dimension(d,e);
return
}var g=e.item.find("a").attr("href");
var b=$(this.workspace.el).find(".sidebar").find('a[href="'+g+'"]').parent("li");
b.css({fontWeight:"bold"});
b.parents(".parent_dimension").find(".root").css({fontWeight:"bold"});
if(e.item.find("a").hasClass("dimension")){if(e.item.parents(".fields_list").attr("title")=="COLUMNS"||e.item.parents(".fields_list").attr("title")=="GROUPS"){var a=$("<span />").addClass("sort").addClass("none")
}else{a=$("<span />").addClass("sprite")
}e.item.addClass("d_dimension").prepend(a)
}else{e.item.addClass("d_measure")
}var f=e.item.find("a").attr("href").replace("#","");
var c=e.item.parent(".connectable").children().index(e.item);
e.item.attr("id",this.workspace.uniqueId("uid-"));
this.workspace.query.move_dimension(f,$(d.target).parent(),c);
d.stopPropagation()
},move_dimension:function(b,c){var d=c.item.find("a").attr("href").replace("#","");
var a=c.item.parent(".connectable").children().index(c.item);
if(!c.item.hasClass("deleted")){this.workspace.query.move_dimension(d,c.item.parents(".fields_list_body"),a)
}b.stopPropagation();
return false
},remove_dimension:function(d,e){var h=e.draggable.find("a").attr("href");
var a=$(this.workspace.el).find(".sidebar").find('a[href="'+h+'"]').parent("li");
a.draggable("enable").css({fontWeight:"normal"});
if(a.parents(".parent_dimension").children().children(".ui-state-disabled").length===0){a.parents(".parent_dimension").find(".root").css({fontWeight:"normal"})
}var g="";
var f=h.replace("#","");
$target_el=e.draggable.parent().parent("div.fields_list_body");
if($target_el.hasClass("columns")){g="COLUMNS"
}if($target_el.hasClass("group")){g="GROUP"
}if($target_el.hasClass("filter")){g="FILTER"
}var c=$target_el.find("li.ui-draggable").index($target_el.find('a[href="#'+f+'"]').parent());
var b="/"+g+"/"+f+"/POSITION/"+c;
this.workspace.query.action.del(b,{success:this.workspace.query.run});
e.draggable.addClass("deleted").remove();
d.stopPropagation();
d.preventDefault();
return false
},sort:function(e,f){var b=$(e.target).parent().find(".dimension");
var d=b.attr("href").replace("#","");
var g=b.parent(".ui-draggable");
var c=g.parent(".connectable").children().index(g);
if(g.parent(".connectable").parent().hasClass("columns")){target="COLUMNS"
}if(g.parent(".connectable").parent().hasClass("group")){target="GROUP"
}$(e.target).cycleClass(["none","up","down"]);
var a="NONE";
if($(e.target).hasClass("up")){a="ASC"
}if($(e.target).hasClass("down")){a="DESC"
}this.workspace.query.action.post("/"+target+"/"+d+"/POSITION/"+c+"/SORT/"+a,{success:this.workspace.query.run})
},selections:function(d,f){var a=$(d.target).hasClass("sprite")?$(d.target).parent().find(".dimension"):$(d.target);
var c=a.attr("href").replace("#","");
var h=a.parent(".ui-draggable");
var b=h.parent(".connectable").children().index(h);
if(a.parents(".fields_list").attr("title")=="COLUMNS"){(new ColumnConfigModal({target:a,index:b,name:a.text(),key:c,workspace:this.workspace})).open()
}if(a.parents(".fields_list").attr("title")=="FILTERS"){(new SelectionsModal({target:a,name:a.text(),key:c,workspace:this.workspace})).open()
}try{d.preventDefault()
}catch(g){}return false
}});