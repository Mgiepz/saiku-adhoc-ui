var InplaceEdit=Backbone.Model.extend({initialize:function(b,a){_.bindAll(this,"attach_listeners","clicked_element");
this.query=a.query;
this.query.bind("report:render",this.attach_listeners)
},attach_listeners:function(a){$(a.report.el).find(".saiku").click(this.clicked_element).hover(function(){$(this).addClass("report-hover")
},function(){$(this).removeClass("report-hover")
});
if(this.query.lastEditElement!=null){$(a.report.el).find("."+this.query.lastEditElement).first().click()
}},clicked_element:function(d){$target=$(d.target);
$target=$(d.target).is("span")?$(d.target).parent():$(d.target);
var a=$target.attr("class").split(/\s+/);
var f;
for(var b=0;
b<a.length;
b++){var g=a[b];
if(g.substring(0,3)=="rpt"){f=g;
break
}}var e=f.split("-");
if($("."+f).hasClass("adhoc-highlight")){$("td").removeClass("adhoc-highlight");
this.query.workspace.edit_panel.disable()
}else{$("td").removeClass("adhoc-highlight");
$("."+f).addClass("adhoc-highlight");
this.query.workspace.trigger("report:edit",{type:e[1],id:f})
}if(!$(".adhoc-highlight").length){this.query.lastEditElement=null
}},check_input:function(a){if(a.which==13){this.save_writeback(a)
}else{if(a.which==27||a.which==9){this.cancel_writeback(a)
}}return false
},save_writeback:function(a){var c=$(a.target).closest("input");
this.set({value:c.val(),position:c.parent().attr("rel")});
this.save();
var b=c.val();
c.parent().text(b)
},cancel_writeback:function(a){var b=$(a.target).closest("input");
b.parent().text(b.parent().attr("alt"))
},parse:function(){this.query.run()
},url:function(){return this.query.url()+"/edit/"+this.get("position")+"/"+this.get("value")
}});