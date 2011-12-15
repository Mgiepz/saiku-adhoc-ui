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