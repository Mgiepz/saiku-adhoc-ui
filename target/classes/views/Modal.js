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