var ReportSetupModal=Modal.extend({type:"reportsetup",buttons:[{text:"Save",method:"save"},{text:"Cancel",method:"close"}],events:{"click a":"call"},changed:function(a){var b=$(a.currentTarget)
},initialize:function(a){_.extend(this,a);
this.options.title="Setup Report "+this.name;
this.message="Fetching config...";
this.show_unique=false;
this.query=a.workspace.query;
_.bindAll(this,"fetch_values","populate","finished","changed");
this.bind("open",this.post_render);
this.render();
this.fetch_values()
},fetch_values:function(b,a){this.workspace.query.action.get("/../../discover/templates",{success:this.populate})
},populate:function(b,a){var c=_.template($("#report-setup").html())(this);
$(this.el).find(".dialog_body").html(c);
$caroussel=$("#template-carousel ul");
$.each(a,function(){var d=this.name.split(".")[0]+".png";
var e=Settings.REST_URL+"/../resources/"+d;
$caroussel.append('<li><img src="'+e+'" width="75" height="75" alt="" /></li>')
});
$("#template-carousel").jcarousel({wrap:"circular",itemVisibleInCallback:{onAfterAnimation:function(g,e,d,f){alert(e)
}}});
Application.ui.unblock()
},post_render:function(a){$(a.modal.el).parents(".ui-dialog").css({width:"200px"})
},save:function(){return false
},finished:function(){$(this.el).dialog("destroy").remove();
this.query.run()
}});