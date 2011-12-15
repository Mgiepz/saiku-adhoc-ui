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