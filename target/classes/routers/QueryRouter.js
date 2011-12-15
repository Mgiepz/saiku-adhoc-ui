var QueryRouter=Backbone.Router.extend({routes:{"query/open/:query_name":"open_query"},open_query:function(a){Settings.ACTION="OPEN_QUERY";
var c={name:a,solution:Settings.GET.SOLUTION||"",path:Settings.GET.PATH||"",action:Settings.GET.ACTION||"",biplugin:true};
var d=new SavedQuery(c);
var b="name="+c.name+"&solution="+c.solution+"&path="+c.path+"&action="+c.action;
d.fetch({data:b,success:d.move_query_to_workspace})
}});
Application.routers.push(new QueryRouter());