/*
 * ExportFileModal.js
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
 * Dialog for column configuration
 */
var ExportFileModal = Modal.extend({
    type: "export",
    
    buttons: [
        { text: "Save", method: "save" },
        { text: "Cancel", method: "close" }
    ],
    
    events: {
        'click a': 'call' 
    },
    
    initialize: function(args) {

        // Initialize properties
        _.extend(this, args);
        this.options.title = "Export " + args.extension;
        this.message = "Fetching repository...";
        this.query = args.workspace.query;
        this.extension = args.extension;
        _.bindAll(this, "finished","post_render","save");
              
        // Resize when rendered
        this.bind('open', this.post_render);

		this.render(); 

    },

    post_render: function(args) {
    	
       this.treeTemplate = _.template($("#template-filetree").html())(); 

    	$(this.el).find('.dialog_body').html(this.treeTemplate);
    	
    	$.ajaxSetup({traditional:true});

    	var url = "http://localhost:8080/pentaho/content/adhoc-service/ExploreFolder?fileExtensions=." + this.extension.toLowerCase();
    	
    	var that = this;
    	
    	 selectedFile = "";
          $('#container_id').fileTree(
          {
            root: '/',
            script: url,
            expandSpeed: 1000,
            collapseSpeed: 1000,
            multiFolder: false,
            folderClick:
            function(obj,folder){
              if($(".selectedFolder").length > 0)$(".selectedFolder").attr("class","");
              $(obj).attr("class","selectedFolder");
              that.selectedFolder = folder;//TODO:
            }
          },
          function(file) {
            that.selectedFile = file;
            $(".selectedFile").attr("class","");
            $("a[rel='" + file + "']").attr("class","selectedFile");
          });

        $(this.el).parents('.ui-dialog').css({ width: "200px" });
        
    },
    
    save: function() {
    	$.ajaxSetup({traditional:false});
    	
    	var file = $("#fileInput").val();
    	
    	if(file=='undefined' || this.selectedFolder == 'undefined'){
    		return false;
    	}
	
		var values = {"path": this.selectedFolder ,"file": file};

        this.query.action.post('/EXPORT/' + this.extension, { 
            success: this.finished,
            data: values
        });

        return false;
    },
    
    finished: function() {
    	$.ajaxSetup({traditional:false});
        $(this.el).dialog('destroy').remove();
    }
});