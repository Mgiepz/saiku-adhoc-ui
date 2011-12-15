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