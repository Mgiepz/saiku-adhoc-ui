var puc={allowSave:function(a){if(top.mantle_initialized!==undefined&&top.mantle_initialized&&top.parent.enableAdhocSave){if(window.ALLOW_PUC_SAVE===undefined||ALLOW_PUC_SAVE){top.parent.enableAdhocSave(a)
}}},refresh_repo:function(){if(top.mantle_initialized!==undefined&&top.mantle_initialized){top.mantle_refreshRepository()
}},save_to_solution:function(b,a,f,d,c){var e=Application.tabs._tabs[0].content.query;
e.action.get("/json",{success:function(h,g){(new SavedQuery({name:b,newname:e.get("name"),json:JSON.stringify(jQuery.parseJSON(g.json),null," "),solution:a,path:f,action:b,overwrite:c})).save({success:function(){puc.refresh_repo()
}})
}})
}};
var RepositoryBrowserControllerProxy=function(){this.remoteSave=puc.save_to_solution
};
var Wiz=function(){this.currPgNum=0
};
var WaqrProxy=function(){this.wiz=new Wiz();
this.repositoryBrowserController=new RepositoryBrowserControllerProxy()
};
var gCtrlr=new WaqrProxy();
var savePg0=function(){};
if(Settings.BIPLUGIN){Settings.PLUGIN=true;
Settings.REST_URL=Settings.BASE_URL+Settings.REST_MOUNT_POINT;
$(document).ready(function(){Application.session=new Session()
})
}var BIPlugin={bind_callbacks:function(a){if(Settings.MODE=="view"){a.toggle_sidebar();
$(a.el).find(".sidebar_separator").remove();
$(a.el).find(".workspace_inner").css({"margin-left":0});
$(a.el).find(".workspace_fields").remove()
}if(Settings.MODE=="view"){$(a.toolbar.el).find(".run, .auto, .toggle_fields, .toggle_sidebar").parent().remove()
}a.bind("query:result",function(c){var b=c.data.resultset&&c.data.resultset.length>0;
puc.allowSave(b)
})
}};
Application.events.bind("session:new",function(a){if(Settings.PLUGIN){$("#header").remove();
if(Application.tabs._tabs[0]&&Application.tabs._tabs[0].content){BIPlugin.bind_callbacks(Application.tabs._tabs[0].content)
}a.session.bind("workspace:new",function(b){BIPlugin.bind_callbacks(b.workspace)
})
}});