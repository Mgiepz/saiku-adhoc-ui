/**
 * Controls the appearance and behavior of the dimension list
 * 
 * This is where drag and drop lives
 */
var MdModelList = Backbone.View.extend({
    events: {
        'click span': 'select',
        'click a': 'select'
    },
    
    initialize: function(args) {
        // Don't lose this
        _.bindAll(this, "render", "load_md_model");
        
        // Bind parent element
        this.workspace = args.workspace;
        //this.mdModel = args.mdModel.split('/')[1];
        this.mdModel = args.mdModel;

     	// Fetch from the server if we haven't already
        if (args.mdModel && args.mdModel.has('template')) {
            this.load_md_model();
        } else if (! args.mdModel){
        	alert("..." + args.mdModel);
            $(this.el).html('Could not load model. Please log out and log in again.');
        } else {
            $(this.el).html('Loading...');
            args.mdModel.fetch({ success: this.load_md_model });
        }
    },
    
    load_md_model: function() {
        this.template = this.mdModel.get('template');
        this.render(); 
        this.workspace.trigger('models:loaded');
    },
    
    render: function() {
        // Pull the HTML from cache and hide all dimensions
        $(this.el).html(this.template)
            .find('.hide').hide().removeClass('hide');

		
		var colprototype =	"<li class=\"hide\">" +
			"<a title=\"calc_column\" class=\"dimension\" href=\"#CALCULATED/COLUMN/UID\">calc_column</a>" +
			"</li>";

        $(this.el).append(colprototype);
           
             
        // Add draggable behavior
        $(this.el).find('.measure,.dimension').parent('li').draggable({
            cancel: '.not-draggable, .hierarchy',
            connectToSortable: $(this.workspace.el)
                .find('.columns > ul, .group > ul, .filter > ul'),
            helper: 'clone',
            opacity: 0.60,
            tolerance: 'pointer',
            cursorAt: {
                top: 10,
                left: 35
            }
        });
    },
    
    select: function(event) {
        var $target = $(event.target).hasClass('root')
            ? $(event.target) : $(event.target).parent().find('span');
        if ($target.hasClass('root')) {
            $target.find('a').toggleClass('folder_collapsed').toggleClass('folder_expand');
            $target.toggleClass('collapsed').toggleClass('expand');
            $target.parents('li').find('ul').children('li').toggle();
        }
        
        return false;
    }
});