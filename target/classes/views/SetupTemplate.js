var SetupTemplate=Backbone.View.extend({type:"reportTemplate",buttons:[{text:"Save",method:"save"},{text:"Cancel",method:"close"}],events:{},changed:function(a){var b=$(a.currentTarget)
},initialize:function(a){_.extend(this,a);
this.query=a.workspace.query;
_.bindAll(this,"fetch_values","populate");
this.render();
this.fetch_values()
},fetch_values:function(b,a){this.workspace.query.action.get("/../../discover/templates",{success:this.populate})
},populate:function(b,a){var c=_.template($("#report-setup").html())(this);
$(this.el).find(".dialog_body").html(c);
$caroussel=$("#template-carousel ul");
$.each(a,function(){var e=this.name.split(".")[0];
var f=Settings.REST_URL+"/../resources/"+e;
$caroussel.append('<li id="'+e+'"><img src="'+f+'.png" width="75" height="75" alt="" /></li>')
});
var d=this.workspace.query;
$("#template-carousel").jcarousel({wrap:"circular",itemVisibleInCallback:{onAfterAnimation:function(h,f,e,g){d.template=f.id;
d.run()
}}});
Application.ui.unblock()
}});