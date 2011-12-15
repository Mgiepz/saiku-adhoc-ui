var MdModelList=Backbone.View.extend({events:{"click span":"select","click a":"select"},initialize:function(a){_.bindAll(this,"render","load_md_model");
this.workspace=a.workspace;
this.mdModel=a.mdModel;
if(a.mdModel&&a.mdModel.has("template")){this.load_md_model()
}else{if(!a.mdModel){alert("..."+a.mdModel);
$(this.el).html("Could not load model. Please log out and log in again.")
}else{$(this.el).html("Loading...");
a.mdModel.fetch({success:this.load_md_model})
}}},load_md_model:function(){this.template=this.mdModel.get("template");
this.render();
this.workspace.trigger("models:loaded")
},render:function(){$(this.el).html(this.template).find(".hide").hide().removeClass("hide");
var a='<li class="hide"><a title="calc_column" class="dimension" href="#CALCULATED/COLUMN/UID">calc_column</a></li>';
$(this.el).append(a);
$(this.el).find(".measure,.dimension").parent("li").draggable({cancel:".not-draggable, .hierarchy",connectToSortable:$(this.workspace.el).find(".columns > ul, .group > ul, .filter > ul"),helper:"clone",opacity:0.6,tolerance:"pointer",cursorAt:{top:10,left:35}})
},select:function(b){var a=$(b.target).hasClass("root")?$(b.target):$(b.target).parent().find("span");
if(a.hasClass("root")){a.find("a").toggleClass("folder_collapsed").toggleClass("folder_expand");
a.toggleClass("collapsed").toggleClass("expand");
a.parents("li").find("ul").children("li").toggle()
}return false
}});