/**
 * The base class for all modal dialogs
 */
var EditPanel = Backbone.View.extend({
	id: "edit_panel",

/*
    events: {
        'click a': 'call'
    },
*/    
 
    buttons: [
        { text: "Submit", method: "submit" }
    ],
    
    template: function() {
        return _.template("<!--div class='dialog_icon'></div-->" +
                "<div class='edit_panel_body'></div>" +
        		"<div class='dialog_footer'>" +
            "<% _.each(buttons, function(button) { %>" +
                "<a class='form_button' href='#<%= button.method %>'>&nbsp;<%= button.text %>&nbsp;</a>" +
            "<% }); %>" +
            "</div>")(this);
    },
    
    initialize: function(args) {
        _.extend(this, args);
        //_.bindAll(this, "call");
        _.extend(this, Backbone.Events);
    },
    
    render: function() {
		$("#edit_panel").html(this.template());
        return this;
    },
    
    submit: function(event) {
        
		alert(submit);

        return false;
    }
});