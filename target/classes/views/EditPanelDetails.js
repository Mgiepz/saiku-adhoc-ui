var EditPanelDetails=EditPanel.extend({initialize:function(a){alert(a.elment);
_.extend(this,a);
this.workspace=a.workspace;
this.id=a.element;
this.query=a.workspace.query;
_.bindAll(this,"fetch_values","populate","render");
this.render();
this.fetch_values()
},populate:function(b,a){var c=_.template($("#template-column-setup").html())();
$("#edit_panel .edit_panel_body").empty();
$("#edit_panel .edit_panel_body").hide().append(c).fadeIn("slow")
},fetch_values:function(){this.workspace.query.action.get("/DETAILS/ELEMENT/"+this.id,{success:this.populate})
}});