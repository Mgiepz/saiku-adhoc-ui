var EditPanelDetailsHeader=Backbone.View.extend({id:"edit_panel",template:function(){return _.template($("#template-edit-panel-details-header").html())()
},initialize:function(a){_.bindAll(this,"render")
},render:function(){$("#edit_panel").empty();
$("#edit_panel").html(this.template());
return this
}});