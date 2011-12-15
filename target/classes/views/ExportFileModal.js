var ExportFileModal=Modal.extend({type:"export",buttons:[{text:"Save",method:"save"},{text:"Cancel",method:"close"}],events:{"click a":"call"},initialize:function(a){_.extend(this,a);
this.options.title="Export "+a.extension;
this.message="Fetching repository...";
this.query=a.workspace.query;
this.extension=a.extension;
_.bindAll(this,"finished","post_render","save");
this.bind("open",this.post_render);
this.render()
},post_render:function(b){this.treeTemplate=_.template($("#template-filetree").html())();
$(this.el).find(".dialog_body").html(this.treeTemplate);
$.ajaxSetup({traditional:true});
var a="http://localhost:8080/pentaho/content/adhoc-service/ExploreFolder?fileExtensions=."+this.extension.toLowerCase();
var c=this;
selectedFile="";
$("#container_id").fileTree({root:"/",script:a,expandSpeed:1000,collapseSpeed:1000,multiFolder:false,folderClick:function(e,d){if($(".selectedFolder").length>0){$(".selectedFolder").attr("class","")
}$(e).attr("class","selectedFolder");
c.selectedFolder=d
}},function(d){c.selectedFile=d;
$(".selectedFile").attr("class","");
$("a[rel='"+d+"']").attr("class","selectedFile")
});
$(this.el).parents(".ui-dialog").css({width:"200px"})
},save:function(){$.ajaxSetup({traditional:false});
var b=$("#fileInput").val();
if(b=="undefined"||this.selectedFolder=="undefined"){return false
}var a={path:this.selectedFolder,file:b};
this.query.action.post("/EXPORT/"+this.extension,{success:this.finished,data:a});
return false
},finished:function(){$.ajaxSetup({traditional:false});
$(this.el).dialog("destroy").remove()
}});