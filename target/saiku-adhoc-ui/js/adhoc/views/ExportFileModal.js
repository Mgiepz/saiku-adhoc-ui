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