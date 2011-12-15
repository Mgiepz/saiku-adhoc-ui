var EditPanel=Backbone.View.extend({id:"edit_panel",buttons:[{text:"Submit",method:"submit"}],template:function(){return _.template("<!--div class='dialog_icon'></div--><div class='edit_panel_body'></div><div class='dialog_footer'><% _.each(buttons, function(button) { %><a class='form_button' href='#<%= button.method %>'>&nbsp;<%= button.text %>&nbsp;</a><% }); %></div>")(this)
},initialize:function(a){_.extend(this,a);
_.extend(this,Backbone.Events)
},render:function(){$("#edit_panel").html(this.template());
return this
},submit:function(a){alert(submit);
return false
}});