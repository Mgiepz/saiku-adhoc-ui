var Settings={VERSION:"AdhocReporting 0.0 SNAPSHOT",BASE_URL:"http://localhost:8080/pentaho/content",REST_MOUNT_POINT:"/saiku-adhoc/rest",MODELS_PREFETCH:true,BIPLUGIN:true,HIDE_ERRORS:false,START_WITH_REPORT:true,QUERY_PROPERTIES:{"saiku.adhoc.query.automatic_execution":"true"},PLUGINS:["ReportDesigner"],LOCALSTORAGE_EXPIRATION:0*60*60*1000};
Settings.GET=function(){var a=document.location.search;
a=a.split("+").join(" ");
var e={},d,b=/[?&]?([^=]+)=([^&]*)/g;
while(d=b.exec(a)){var c=decodeURIComponent(d[2]);
if(!isNaN(c)){c=parseInt(c)
}if(c==="true"){c=true
}if(c==="false"){c=false
}e[decodeURIComponent(d[1]).toUpperCase()]=c
}return e
}();
_.extend(Settings,Settings.GET);
Settings.REST_URL=Settings.BASE_URL+Settings.REST_MOUNT_POINT;
var Constants={horizontalAlignments:["LEFT","CENTER","RIGHT"],verticalAlignments:["TOP","CENTER","BOTTOM"]};
var AggTypes={NONE:"None",SUM:"Sum",AVERAGE:"Average",COUNT:"Count",COUNT_DISTINCT:"Count Distinct",MINIMUM:"Minimum",MAXIMUM:"Maximum"};
var defaultCalcColumn={name:"Calculated Column",id:"NEW",description:"",formula:'="Hello World"',category:"CALCULATED",sort:"NONE",fieldType:"",uid:null,defaultAggType:"NONE",elementFormat:{horizontalAlignment:"LEFT",verticalAlignment:"CENTER",fontName:"Arial",fontColor:"#662b1b",backgroundColor:null,fontSize:10},columnHeaderFormat:{horizontalAlignment:"LEFT",verticalAlignment:"CENTER",fontName:"Arial",fontColor:"#662b1b",backgroundColor:null,fontSize:10},aggTypes:["NONE"],selectedAggType:"NONE",formatMask:null,forGroupOnly:false,selectedSummaryType:"NONE"};

var Column=Backbone.Model.extend({});

var Condition=Backbone.Model.extend({});

var Domain=Backbone.Model.extend({});
var FileTree=Backbone.Model.extend({initialize:function(a){this.url=encodeURI(Settings.REST_URL+"/repository/browse/"+a.dir+"/"+a.extensions)
},parse:function(a){this.set({template:_.template($("#template-filetree").html())({tree:a}),data:a});
return a
}});
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
var MdModel=Backbone.Model.extend({initialize:function(a){this.url=encodeURI(Settings.REST_URL+"/discover/"+a.path+"/model")
},parse:function(a){this.set({template:_.template($("#template-md-model").html())({mdModel:a}),data:a});
localStorage&&localStorage.setItem("md_model."+this.get("key"),JSON.stringify(this));
return a
}});
var Operator=Backbone.Model.extend({});
var Order=Backbone.Model.extend({});
var Properties=Backbone.Model.extend({initialize:function(b,a){this.query=a.query;
this.properties={};
_.extend(this.properties,Settings.QUERY_PROPERTIES);
this.update()
},toggle:function(a){this.properties[a]=this.properties[a]==="true"?"false":"true";
return this
},update:function(){this.attributes={properties:_.template("<% _.each(properties, function(property, name) { %><%= name %> <%= property %>\n<% }); %>")({properties:this.properties})};
this.save()
},parse:function(a){if(typeof a=="object"){_.extend(this.properties,a)
}this.query.workspace.trigger("properties:loaded")
},url:function(){return encodeURI(this.query.url()+"/properties")
}});
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
var QueryAction=Backbone.Model.extend({initialize:function(b,a){this.query=a.query;
this.url=this.query.url
},get:function(b,a){this.handle("fetch",b,a)
},post:function(b,a){this.handle("save",b,a)
},put:function(b,a){this.id=_.uniqueId("queryaction_");
this.handle("save",b,a);
delete this.id
},del:function(b,a){this.id=_.uniqueId("queryaction_");
this.handle("delete",b,a);
delete this.id
},handle:function(c,b,a){this.url=this.query.url()+escape(b);
this.attributes=a.data?a.data:{};
if(c=="save"){this.parse=a.success;
this.save()
}else{if(c=="delete"){this.destroy(a)
}else{if(c=="fetch"){this.parse=function(){};
this.fetch(a)
}}}}});
var ReportResult=Backbone.Model.extend({initialize:function(b,a){this.query=a.query
},parse:function(a){this.query.workspace.trigger("query:report",{workspace:this.query.workspace,data:a});
Application.ui.unblock()
},url:function(){var a=this.query.template!=null?this.query.template:"default";
var b=this.query.page!=null?this.query.page:"1";
return encodeURI(this.query.url()+"/report/"+a+"/"+b)
}});
var SavedQuery=Backbone.Model.extend({parse:function(a,b){this.json=a.json
},url:function(){return encodeURI(Settings.REST_URL+"/repository/query/"+this.get("name"))
},move_query_to_workspace:function(b,a){var d=new Query({json:b.json},{name:b.get("name")});
var c=Application.tabs.add(new Workspace({query:d}))
}});
var Repository=Backbone.Collection.extend({model:SavedQuery,initialize:function(b,a){this.dialog=a.dialog
},parse:function(a){this.dialog.populate(a)
},url:function(){return encodeURI(Settings.REST_URL+"repository/query")
}});
var Result=Backbone.Model.extend({initialize:function(b,a){this.query=a.query
},parse:function(a){this.query.workspace.trigger("query:result",{workspace:this.query.workspace,data:a});
Application.ui.unblock()
},url:function(){return encodeURI(this.query.url()+"/result")
}});
var ResultList=Backbone.Model.extend({parse:function(a){this.set({template:_.template($("#template-resultlist").html())({categories:respons}),data:a});
return a
}});
var Session=Backbone.Model.extend({initialize:function(){_.extend(this,Backbone.Events);
_.bindAll(this,"process_session","templates_callback","prefetch_md_models");
if(!(localStorage.getItem("expiration")>(new Date()).getTime())){localStorage.clear()
}var a=(new Date()).getTime()+Settings.LOCALSTORAGE_EXPIRATION;
localStorage.setItem("expiration",a);
$.get("web/../js/templates/editor-templates.htm",this.templates_callback(this));
return false
},templates_callback:function(a){return function(b){$("body").append(b);
a.fetch({success:a.process_session})
}
},error:function(){$(this.form.el).dialog("open")
},process_session:function(b,a){if(localStorage&&localStorage.getItem("session")===null){localStorage.setItem("session",JSON.stringify(a))
}this.model_navigation=_.template($("#template-models").html())({mdModelInfos:a});
this.mdModels={};
this.mdModelInfos=a;
_.delay(this.prefetch_md_models,200);
$(Application.toolbar.el).prependTo($("#header"));
$("#header").show();
Application.ui.unblock();
Application.tabs.render();
Application.tabs.add(new Workspace());
Application.events.trigger("session:new",{session:this})
},prefetch_md_models:function(){if(!this.mdModels){Log.log(JSON.stringify({Message:"categories not initialized",Session:JSON.stringify(this)}));
return
}for(var b=0;
b<this.mdModelInfos.length;
b++){var d=this.mdModelInfos[b];
var a=d.domainId+"/"+d.modelId;
var c=a;
if(localStorage&&localStorage.getItem("md_model."+a)!==null){this.mdModels[a]=new MdModel(JSON.parse(localStorage.getItem("md_model."+a)))
}else{this.mdModels[a]=new MdModel({path:c,key:a});
this.mdModels[a].fetch()
}}if(Backbone.history){Backbone.history.start()
}},url:function(){var a=(navigator.language||navigator.browserLanguage||navigator.systemLanguage||navigator.userLanguage).substring(0,2).toLowerCase();
return encodeURI(Settings.REST_URL+"/discover/"+a)
}});
var data=[{modelName:"Human Resources",domainId:"steel-wheels/metadata.xmi",modelId:"BV_HUMAN_RESOURCES",modelDescription:"This model contains information about Employees."},{modelName:"Inventory",domainId:"steel-wheels/metadata.xmi",modelId:"BV_INVENTORY",modelDescription:"This model contains information about products and product inventory."},{modelName:"Orders",domainId:"steel-wheels/metadata.xmi",modelId:"BV_ORDERS",modelDescription:"This model contains information about customers and their orders."}];


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


var EditPanel=Backbone.View.extend({id:"edit_panel",buttons:[{text:"Submit",method:"submit"}],template:function(){return _.template("<!--div class='dialog_icon'></div--><div class='edit_panel_body'></div><div class='dialog_footer'><% _.each(buttons, function(button) { %><a class='form_button' href='#<%= button.method %>'>&nbsp;<%= button.text %>&nbsp;</a><% }); %></div>")(this)
},initialize:function(a){_.extend(this,a);
_.extend(this,Backbone.Events)
},render:function(){$("#edit_panel").html(this.template());
return this
},submit:function(a){alert(submit);
return false
}});
var EditPanelDetails=EditPanel.extend({initialize:function(a){alert(a.elment);
_.extend(this,a);
this.workspace=a.workspace;
this.id=a.element;
this.query=a.workspace.query;
_.bindAll(this,"fetch_values","populate","render");
this.render();
this.fetch_values()
},populate:function(b,a){var c=_.template($("#template-column-setup").html())();
$("#edit_panel .edit_panel_body").empty();
$("#edit_panel .edit_panel_body").hide().append(c).fadeIn("slow")
},fetch_values:function(){this.workspace.query.action.get("/DETAILS/ELEMENT/"+this.id,{success:this.populate})
}});
var ReportEditPanel=Backbone.View.extend({id:"edit_panel",template:function(){return _.template($("#template-report-edit-panel").html())()
},initialize:function(a){_.bindAll(this,"render")
},render:function(){$("#edit_panel").empty();
$("#edit_panel").html(this.template());
return this
}});
var ElementFormatPanel=Backbone.View.extend({id:"format",events:{"click a":"call","change .sizeSelector select":"size_select"},initialize:function(a){this.workspace=a.workspace;
this.query=a.workspace.query;
_.extend(this,a);
_.extend(this,Backbone.Events);
_.bindAll(this,"render","reflect_formatting","fetch_values","save","call","align_left","align_center","align_right","textcolor_callback","size_select")
},template:function(){return _.template($("#format-editor").html())()
},textcolor_callback:function(a){return function(b,d,c){a.json.format.fontColor="#"+d;
a.save(a.json)
}
},bgcolor_callback:function(a){return function(b,d,c){a.json.format.backgroundColor="#"+d;
a.save(a.json)
}
},font_callback:function(a){return function(b){a.json.format.fontName=$(b.target).val();
a.save(a.json)
}
},size_select:function(a){this.json.format.fontSize=$(a.target).val();
this.save(this.json)
},disable:function(){$(this.el).addClass("disabled_editor");
$(this.el).find("select").attr("disabled",true)
},render:function(){$(this.el).html(this.template());
$(this.el).addClass("disabled_editor");
$(this.el).find(".fontPicker").fontPicker();
$(this.el).find("#fontPickerInput").change(this.font_callback(this));
$(this.el).find(".text-color").ColorPicker({color:"#0000ff",onShow:function(b){$(b).fadeIn(500);
return false
},onHide:function(b){$(b).fadeOut(500);
return false
},onSubmit:this.textcolor_callback(this)});
$(this.el).find(".background-color").ColorPicker({color:"#0000ff",onShow:function(b){$(b).fadeIn(500);
return false
},onHide:function(b){$(b).fadeOut(500);
return false
},onSubmit:this.bgcolor_callback(this)});
var a=$(this.el).find(".sizeSelector").append('&nbsp;<select> 	 		<option value="6">6</option> 		    <option value="8">8</option> 		    <option value="9">9</option> 		    <option value="10">10</option> 		    <option value="11">11</option> 		    <option value="12">12</option> 		    <option value="13">13</option> 		    <option value="14">14</option> 		    <option value="15">15</option> 		    <option value="16">16</option> 		    <option value="17">17</option> 		    <option value="18">18</option> 		    <option value="20">20</option> 		    <option value="22">22</option> 		    <option value="24">24</option> 		    <option value="28">28</option> 		    <option value="32">32</option> 		  </select>');
return this
},reflect_formatting:function(c,b){this.json=b;
var g=this.json.format;
$(this.el).removeClass("disabled_editor");
$(this.el).find("select").removeAttr("disabled");
$(this.el).find(".horz").removeClass("on");
$(this.el).find(".vert").removeClass("on");
var f=g.horizontalAlignment.toLowerCase();
$(this.el).find(".horz.align-"+f).addClass("on");
var a=g.verticalAlignment.toLowerCase();
$(this.el).find(".vert.align-"+a).addClass("on");
$(this.el).find(".sizeSelector select").val(g.fontSize);
$(this.el).find("#fontPickerInput").val(g.fontName);
var d=this;
var e={willOpenEditInPlace:function(i,h){return d.json.value
}};
$(".adhoc-highlight").each(function(){if(!($(this).attr("class").indexOf("rpt-dtl")>-1)){$(this).editInPlace({callback:function(h,i){d.json.value=i;
d.save(d.json);
return true
},delegate:e,show_buttons:true,default_text:function(){return d.json.value
},select_text:function(){return d.json.value
},select_options:"selected:disabled"})
}})
},fetch_values:function(a,b){this.element=a;
this.workspace.query.action.get("/FORMAT/ELEMENT/"+a,{success:this.reflect_formatting})
},save:function(a){this.workspace.query.action.post("/FORMAT/ELEMENT/"+this.element,{success:this.finished,data:a});
return false
},finished:function(){this.query.run()
},call:function(a){var b=a.target.hash.replace("#","");
if(!$(a.target).hasClass("disabled_toolbar")&&this[b]){this[b](a)
}return false
},align_left:function(a){this.json.format.horizontalAlignment="LEFT";
this.save(this.json)
},align_center:function(a){this.json.format.horizontalAlignment="CENTER";
this.save(this.json)
},align_right:function(a){this.json.format.horizontalAlignment="RIGHT";
this.save(this.json)
},align_top:function(a){this.json.format.verticalAlignment="TOP";
this.save(this.json)
},align_middle:function(a){this.json.format.verticalAlignment="MIDDLE";
this.save(this.json)
},align_bottom:function(a){this.json.format.verticalAlignment="BOTTOM";
this.save(this.json)
}});
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
var Modal=Backbone.View.extend({tagName:"div",className:"dialog",type:"modal",message:"Put content here",options:{autoOpen:false,modal:true,title:"Modal dialog",resizable:false,draggable:false},events:{"click a":"call"},buttons:[{text:"OK",method:"close"}],template:function(){return _.template("<div class='dialog_icon'></div><div class='dialog_body'><%= message %></div><div class='dialog_footer'><% _.each(buttons, function(button) { %><a class='form_button' href='#<%= button.method %>'>&nbsp;<%= button.text %>&nbsp;</a><% }); %></div>")(this)
},initialize:function(a){_.extend(this,a);
_.bindAll(this,"call");
_.extend(this,Backbone.Events)
},render:function(){$(this.el).html(this.template()).addClass("dialog_"+this.type).dialog(this.options);
return this
},call:function(a){var b=a.target.hash.replace("#","");
if(!$(a.target).hasClass("disabled_toolbar")&&this[b]){this[b](a)
}return false
},open:function(){$(this.el).dialog("open");
this.trigger("open",{modal:this});
return this
},close:function(){$(this.el).dialog("destroy").remove();
return false
}});
var Report=Backbone.View.extend({className:"report_inner",initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"render","process_data","show_editor","prevPage","nextPage","firstPage","lastPage");
this.workspace.bind("query:report",this.render);
this.workspace.bind("report:edit",this.show_editor)
},template:function(){return _.template($("#navigator").html())()
},show_editor:function(a){var c=a.id.split("-");
var b=c[2]+"-"+c[3]+"-"+c[4];
this.workspace.query.lastEditElement=a.id;
this.workspace.edit_panel.fetch_values(a.id,a.type)
},render:function(a){_.delay(this.process_data,0,a)
},process_data:function(b){this.json=b.data;
var a=b.data.data;
$(this.el).empty();
$(this.el).html(a).wrapInner('<div class="report_border" />');
$(".report_border").width($(".report_border table").width()+30);
$(this.el).prepend(this.template());
$(".report-navigator").width($(".report_border").width());
$(".report-navigator #curr_page").html(b.data.currentPage+1);
$(".report-navigator #off_page").html(b.data.pageCount).click();
$(".report-navigator #prev").click(this.prevPage);
$(".report-navigator #next").click(this.nextPage);
$(".report-navigator #first").click(this.firstPage);
$(".report-navigator #last").click(this.lastPage);
this.template_select=new SetupTemplate({workspace:this.workspace});
this.workspace.query.trigger("report:render",{workspace:this.workspace,report:this})
},prevPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var b=a>1?a-1:1;
this.workspace.query.page=b;
this.workspace.query.run(true)
},nextPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var d=this.json.pageCount;
var b=a<d?a+1:d;
this.workspace.query.page=b;
this.workspace.query.run(true)
},firstPage:function(c){var a=parseInt($(".report-navigator #curr_page").html());
var b=1;
this.workspace.query.page=b;
this.workspace.query.run(true)
},lastPage:function(b){var c=this.json.pageCount;
var a=c;
this.workspace.query.page=a;
this.workspace.query.run(true)
},no_results:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>No Report</td></tr>")
},error:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>"+a.data[0][0].value+"</td></tr>")
}});
var ReportEditPanel=Backbone.View.extend({template:function(){return _.template($("#template-report-edit-panel").html())()
},initialize:function(a){this.workspace=a.workspace;
this.query=a.query
},render:function(){$(this.el).html(this.template());
return this
}});

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
var Tab=Backbone.View.extend({tagName:"li",events:{"click a":"select","mousedown a":"remove","click .close_tab":"remove"},template:function(){return _.template("<a href='#<%= id %>'><%= caption %></a><span class='close_tab sprite'>Close tab</span>")({id:this.id,caption:this.caption})
},initialize:function(a){_.extend(this,Backbone.Events);
_.extend(this,a);
this.content.tab=this;
this.caption=this.content.caption();
this.id=_.uniqueId("tab_")
},render:function(){this.content.render();
$(this.el).html(this.template());
return this
},destroy:function(){if(this.content&&this.content.query){this.content.query.destroy()
}},select:function(){this.parent.select(this);
$(this.el).addClass("selected");
this.trigger("tab:select");
return false
},remove:function(a){if(!a||a.which===2||$(a.target).hasClass("close_tab")){$(this.el).remove();
try{this.destroy()
}catch(b){Log.log(JSON.stringify({Message:"Tab could not be removed",Tab:JSON.stringify(this)}))
}this.parent.remove(this)
}return false
}});
var TabPager=Backbone.View.extend({className:"pager_contents",events:{"click a":"select"},initialize:function(a){this.tabset=a.tabset;
$(this.el).hide().appendTo("body")
},render:function(){var a="";
for(var b=0;
b<this.tabset._tabs.length;
b++){a+="<a href='#"+b+"'>"+this.tabset._tabs[b].caption+"</a><br />"
}$(this.el).html(a)
},select:function(b){var a=$(b.target).attr("href").replace("#","");
this.tabset._tabs[a].select();
$(this.el).hide();
b.preventDefault();
return false
}});
var TabSet=Backbone.View.extend({className:"tabs",queryCount:0,events:{"click a.pager":"togglePager"},_tabs:[],render:function(){$(this.el).html('<a href="#pager" class="pager sprite"></a><ul></ul>').appendTo($("#header"));
this.content=$('<div id="tab_panel">').appendTo($("body"));
this.pager=new TabPager({tabset:this});
return this
},add:function(b){var a=new Tab({content:b});
this._tabs.push(a);
this.queryCount++;
a.parent=this;
a.render().select();
$(a.el).appendTo($(this.el).find("ul"));
Application.session.trigger("tab:add",{tab:a});
this.pager.render();
return a
},select:function(a){$(this.el).find("li").removeClass("selected");
this.content.children().detach();
this.content.append($(a.content.el))
},remove:function(c){if(this._tabs.length==1){return
}for(var a=0;
a<this._tabs.length;
a++){if(this._tabs[a]==c){this._tabs.splice(a,1);
Application.session.trigger("tab:remove",{tab:c});
this.pager.render();
var b=this._tabs[a]?a:0;
this._tabs[b].select()
}}},togglePager:function(){$(this.pager.el).toggle();
return false
}});
var Table=Backbone.View.extend({initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"render","process_data");
this.workspace.bind("query:result",this.render)
},render:function(a){_.delay(this.process_data,0,a)
},process_data:function(b){var c=b.data;
if(c==null){return this.no_results(b)
}var a=c.resultset;
var d=[];
for(column in c.metadata){d.push({sTitle:c.metadata[column].colName})
}$(this.el).empty();
$(this.el).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="contents"></table>');
$("#contents").dataTable({aaData:a,aoColumns:d,bAutoWidth:true,bLengthChange:false,iDisplayLength:30,bFilter:false,bSort:false,bJQueryUI:false,sPaginationType:"full_numbers"})
},no_results:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>No results</td></tr>")
},error:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>"+a.data[0][0].value+"</td></tr>")
}});

var Toolbar=Backbone.View.extend({tagName:"div",events:{"click #add_join":"add_join","click #add_union":"add_union","click #create_prpt_output":"create_prpt_output","click #create_table_output":"create_table_output","click #create_xls_output":"create_xls_output",},template:function(){return _.template("<ul><li><a id='new_query' href='#new_query' title='New query' class='new_tab i18n sprite'></a></li><li class='separator'>&nbsp;</li><li><a id='open_query' href='#open_query' title='Open query' class='open_query i18n sprite'></a></li><li class='separator'>&nbsp;</li><li><a id='logout' href='#logout' title='Logout' class='logout i18n sprite'></a></li><li><a id='about' href='#about' title='About' class='about i18n sprite'></a></li><li class='separator'>&nbsp;</li><li><a id='issue_tracker' href='#issue_tracker' title='Issue Tracker' class='bug i18n sprite'></a></li></ul><h1 id='logo'><a href='http://www.analytical-labs.com/' title='Saiku - Next Generation Open Source Analytics' class='sprite'>Saiku</a></h1>")(this)
},initialize:function(){this.render()
},render:function(){$(this.el).attr("id","toolbar").html(this.template());
Application.events.trigger("toolbar:render",{toolbar:this});
return this
},new_query:function(){Saiku.tabs.add(new Workspace());
return false
},open_query:function(){var a=_.detect(Saiku.tabs._tabs,function(b){return b.content instanceof OpenQuery
});
if(a){a.select()
}else{Saiku.tabs.add(new OpenQuery())
}return false
},logout:function(){Saiku.session.logout()
},about:function(){(new AboutModal).render().open();
return false
},issue_tracker:function(){window.open("http://projects.analytical-labs.com/projects/saiku/issues/new");
return false
}});
var Workspace=Backbone.View.extend({className:"tab_container",events:{"click .sidebar_separator":"toggle_sidebar","change .mdModels":"new_query",drop:"remove_concept"},initialize:function(a){_.bindAll(this,"adjust","toggle_sidebar","prepare","new_query","init_query","update_caption","populate_selections","uniqueId");
_.extend(this,Backbone.Events);
this.loaded=false;
this.toolbar=new WorkspaceToolbar({workspace:this});
this.toolbar.render();
this.drop_zones=new WorkspaceDropZone({workspace:this});
this.drop_zones.render();
this.table=new Table({workspace:this});
this.report=new Report({workspace:this});
if(a&&a.query){this.query=a.query;
this.query.workspace=this;
this.query.save({},{success:this.init_query})
}this.idCounter=0;
Application.session.bind("tab:add",this.prepare)
},adjust:function(){$separator=$(this.el).find(".sidebar_separator");
$separator.height($("body").height()-87);
$(this.el).find(".sidebar").height($("body").height()-87);
$(this.el).find(".workspace_results").css({width:$(document).width()-$(this.el).find(".sidebar").width()-30,height:$(document).height()-$("#header").height()-$(this.el).find(".workspace_toolbar").height()-$(this.el).find(".workspace_fields").height()-40})
},caption:function(){if(this.query&&this.query.name){return this.query.name
}return"Unsaved query ("+(Application.tabs.queryCount+1)+")"
},template:function(){return _.template($("#template-workspace").html())({model_navigation:Application.session.model_navigation})
},render:function(){$(this.el).html(this.template());
$(this.el).find(".workspace_toolbar").append($(this.toolbar.el));
$(this.drop_zones.el).insertAfter($(this.el).find(".workspace_toolbar"));
$(this.el).find(".sidebar").droppable({accept:".d_measure, .d_dimension"});
$(this.el).find(".workspace_results").append($(this.table.el));
$(this.el).find(".workspace_report_canvas").append($(this.report.el));
if(Settings.START_WITH_REPORT){$(this.el).find(".workspace_results").hide();
$(this.el).find(".workspace_report").show();
$(".workspace_toolbar .view").addClass("table")
}else{$(this.el).find(".workspace_results").show();
$(this.el).find(".workspace_report").hide()
}this.edit_panel=new ElementFormatPanel({workspace:this,el:$(this.el).find("#edit_panel")});
this.edit_panel.render();
this.tab.bind("tab:select",this.adjust);
$(window).resize(this.adjust);
Application.session.trigger("workspace:new",{workspace:this});
return this
},clear:function(){$(this.el).find(".workspace_results table,.connectable").html("");
this.trigger("workspace:clear")
},adjust:function(){$separator=$(this.el).find(".sidebar_separator");
$separator.height($("body").height()-87);
$(this.el).find(".sidebar").height($("body").height()-87)
},toggle_sidebar:function(){$(this.el).find(".sidebar").toggleClass("hide");
$(this.toolbar.el).find(".toggle_sidebar").toggleClass("on");
var a=$(this.el).find(".sidebar").hasClass("hide")?5:265;
$(this.el).find(".workspace_inner").css({"margin-left":a})
},toggle_report:function(){this.query.reportPerspective=this.query.reportPerspective?false:true;
$(".workspace_toolbar .view").toggleClass("table");
$(this.el).find(".workspace_results").toggle();
$(this.el).find(".workspace_report").toggle()
},prepare:function(){$(this.el).find(".mdModels").parent().animate({backgroundColor:"#AC1614"},"fast").animate({backgroundColor:"#fff"},"fast")
},new_query:function(){if(this.query){this.query.destroy()
}this.selected_model=$(this.el).find(".mdModels").val();
var b=this.selected_model;
var a=this.selected_model.split("/");
this.query=new Query({domainId:a[0],modelId:a[1]},{workspace:this});
this.query.save();
this.init_query()
},init_query:function(){if(this.query.get("json")){var a=JSON.parse(this.query.get("json"));
this.selected_model=a.clientModelSelection
}if(this.selected_model===undefined){this.selected_model=this.query.get("model")
}$(this.el).find(".mdModels").val(this.selected_model);
this.clear();
if(this.selected_model){this.mdmodel_list=new MdModelList({workspace:this,mdModel:Application.session.mdModels[this.selected_model]});
$(this.el).find(".category_tree").html("").append($(this.mdmodel_list.el))
}else{$(this.el).find(".category_tree").html("");
return
}$(this.el).find(".workspace_results").show();
$(this.el).find(".workspace_report").hide();
this.populate_selections()
},populate_selections:function(){if(this.query.get("json")){var g=JSON.parse(this.query.get("json"))
}if(g){var e=g.columns?g.columns:false;
var c=g.groups?g.groups:false;
var p=g.parameters?g.parameters:false;
if(e){var m=$(this.el).find(".columns ul");
for(var h=0;
h<e.length;
h++){var d=e[h];
var a=d.name;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(m)
}}if(c){var l=$(this.el).find(".group ul");
for(var f=0;
f<c.length;
f++){var o=c[f];
var a=o.groupName;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(l)
}}if(p){var j=$(this.el).find(".filter ul");
for(var n=0;
n<p.length;
n++){var b=p[n];
var a=b.name;
var i=$(this.el).find(".category_tree").find('a[title="'+a+'"]').parent();
var k=i.clone().addClass("d_dimension").appendTo(j)
}}this.query.run();
this.trigger("query:new",{workspace:this});
this.query.bind("query:save",this.update_caption)
}},update_caption:function(){var a=this.query.get("name");
$(this.tab.el).find("a").html(a)
},remove_concept:function(a,b){this.drop_zones.remove_dimension(a,b)
},uniqueId:function(a){var b=this.idCounter++;
return a?a+b:b
}});
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
var Application={toolbar:{},tabs:new TabSet(),session:null,events:_.extend({},Backbone.Events),routers:[],ui:{block:function(a){$(".processing,.processing_container").fadeIn();
$(".processing_message").text(a)
},unblock:function(){$(".processing,.processing_container").fadeOut()
}}};
Backbone.emulateHTTP=true;
(function(d){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=String.fromCharCode,b=(function(){try{document.createElement("$")
}catch(e){return e
}}());
d.Base64||(d.Base64={encode:function(f){var p,n,o,m,k,h,j,e=0,g=f.length,l=Math.max,q="";
while(e<g){p=f.charCodeAt(e++)||0;
n=f.charCodeAt(e++)||0;
j=f.charCodeAt(e++)||0;
if(l(p,n,j)>255){throw b
}o=(p>>2)&63;
m=((p&3)<<4)|((n>>4)&15);
k=((n&15)<<2)|((j>>6)&3);
h=j&63;
if(!n){k=h=64
}else{if(!j){h=64
}}q+=a.charAt(o)+a.charAt(m)+a.charAt(k)+a.charAt(h)
}return q
}})
}(this));
Backbone.sync=function(h,d,c){var g;
methodMap={create:"POST",read:"GET",update:"PUT","delete":"DELETE"};
var e=methodMap[h];
var b=Settings.REST_URL+(_.isFunction(d.url)?d.url():d.url);
c.retries=0;
var a=function(j,l,k){c.retries++;
if(c.retries>=10){Application.ui.block("Could not reach server. Please try again later...");
if(c.error){c.error(j,l,k)
}}else{var i=Math.pow(c.retries,2);
Application.ui.block("Having trouble reaching server. Trying again in "+i+" seconds...");
setTimeout(function(){$.ajax(g)
},i*1000)
}};
var f=function(j,k,i){if(c.retries>0){Saiku.ui.unblock()
}c.success(j,k,i)
};
g={url:b,type:e,cache:false,data:d.attributes,contentType:"application/json",dataType:"json",success:f,error:a,beforeSend:function(j){if(!Settings.PLUGIN){var i="Basic "+Base64.encode(Saiku.session.username+":"+Saiku.session.password);
j.setRequestHeader("Authorization",i)
}}};
if(Settings.BIPLUGIN||Backbone.emulateHTTP){if(e==="PUT"||e==="DELETE"){if(Backbone.emulateHTTP){g.data._method=e
}g.type="POST";
g.beforeSend=function(i){i.setRequestHeader("X-HTTP-Method-Override",e)
}
}}$.ajax(g)
};
var QueryRouter=Backbone.Router.extend({routes:{"query/open/:query_name":"open_query"},open_query:function(a){Settings.ACTION="OPEN_QUERY";
var c={name:a,solution:Settings.GET.SOLUTION||"",path:Settings.GET.PATH||"",action:Settings.GET.ACTION||"",biplugin:true};
var d=new SavedQuery(c);
var b="name="+c.name+"&solution="+c.solution+"&path="+c.path+"&action="+c.action;
d.fetch({data:b,success:d.move_query_to_workspace})
}});
Application.routers.push(new QueryRouter());
