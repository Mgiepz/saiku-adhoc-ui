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