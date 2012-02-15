/*
 * ClientError.js
 * 
 * Copyright (c) 2012, Marius Giepz. All rights reserved.
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
var ClientError = Backbone.View.extend({
    className: "client_error",
    
    initialize: function(args) {
        this.query = args.query;
        this.message = args.message;

        _.bindAll(this, "render");
       
    },
    
    template: function() {
       //return _.template($("#client-error").html())();
    },

    render: function() {
    	$('.workspace_error').html('<tr><td>' + this.message + '</td></tr>');
    	Application.ui.unblock();
    }
    
});