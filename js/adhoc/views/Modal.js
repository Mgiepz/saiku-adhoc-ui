/*
 * Modal.js
 * 
 * Copyright (c) 2011, Marius Giepz, OSBI Ltd. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301  USA
 */
/**
 * The base class for all modal dialogs
 */
var Modal = Backbone.View.extend({
    tagName: "div",
    className: "dialog",
    type: "modal",
    message: "Put content here",
    
    options: {
        autoOpen: false,
        modal: true,
        title: "Modal dialog",
        resizable: false,
        draggable: false
    },
    
    events: {
        'click a': 'call',
        'click span.ui-icon-closethick' : 'close'        
    },
    
    buttons: [
        { text: "OK", method: "close" }
    ],
    
    template: function() {
        return _.template("<div class='dialog_icon'></div>" +
                "<div class='dialog_body'><%= message %></div>" +
        		"<div class='dialog_footer'>" +
            "<% _.each(buttons, function(button) { %>" +
                "<a class='form_button' href='#<%= button.method %>'>&nbsp;<%= button.text %>&nbsp;</a>" +
            "<% }); %>" +
            "</div>")(this);
    },
    
    initialize: function(args) {
        _.extend(this, args);
        _.bindAll(this, "call", "center");
        _.extend(this, Backbone.Events);
        
        args.session.bind('workspace:adjust', this.center);
        
        
    },
    
    render: function() {
        $(this.el).html(this.template())
            .addClass("dialog_" + this.type)
            .dialog(this.options);
        
        $(this.el).parent().find('.ui-dialog-titlebar-close').bind('click',this.close);    
            
        return this;
    },
    
    call: function(event) {
        // Determine callback
        var callback = event.target.hash.replace('#', '');
        
        // Attempt to call callback
        if (! $(event.target).hasClass('disabled_toolbar') && this[callback]) {
            this[callback](event);
        }
        
        return false;
    },
    
    open: function() {
        $(this.el).dialog('open');
        this.trigger('open', { modal: this });
        return this;
    },
    
    close: function() {
        $(this.el).dialog('destroy').remove();
        return false;
    },

    center: function (){
    	
    	$dialog = $(this.el).parent('.ui-dialog');
    	
    	var winWidth=$(window).width();
    	var winHeight=$(window).height();
    	var windowCenter=winWidth/2;
    	var itemCenter= $dialog.width()/2;
    	var theCenter=windowCenter-itemCenter;
    	var windowMiddle=winHeight/2;
    	var itemMiddle= $dialog.height()/2;
    	var theMiddle=windowMiddle-itemMiddle;
    	if(winWidth> $dialog.width()){
        	 $dialog.css('left',theCenter);
    	} else {
        	 $dialog.css('left','0');
    	}
    	if(winHeight> $dialog.height()){
        	 $dialog.css('top',theMiddle);
    	} else {
        	 $dialog.css('top','0');
    	}
    	$dialog.css("position", "absolute");
}    
        
});