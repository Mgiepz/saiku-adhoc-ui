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