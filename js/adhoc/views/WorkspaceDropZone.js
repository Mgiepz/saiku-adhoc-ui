/**
 * 
 * Sets up workspace drop zones for DnD and other interaction
 */
var WorkspaceDropZone = Backbone.View.extend({
    template: function() {
        return _.template($("#template-workspace-dropzones").html())();
    },
    
    events: {
        'sortstop': 'select_dimension',
        'click a': 'selections',
        'click .parent_dimension ul li a' : 'select_dimension',
        'click span.sort': 'sort'
    },
    
    initialize: function(args) {
        // Keep track of parent workspace
        this.workspace = args.workspace;
        
        // Maintain `this` in jQuery event handlers
        _.bindAll(this, "select_dimension", "move_dimension", 
                "remove_dimension", "sort");
    },
    
    render: function() {
        // Generate drop zones from template
     
        $(this.el).html(this.template());
        
        // Activate drop zones
        $(this.el).find('.connectable').sortable({
            connectWith: $(this.el).find('.connectable'),
            cursorAt: {
                top: 10,
                left: 35
            },
            forcePlaceholderSize: true,
            items: '> li',
            opacity: 0.60,
            placeholder: 'placeholder',
            tolerance: 'pointer'
        });
        
        return this; 
    },
    
    select_dimension: function(event, ui) {
        // Short circuit if this is a move
        if (ui.item.hasClass('d_measure') ||
                ui.item.hasClass('d_dimension')) {
            this.move_dimension(event, ui);
            return;
        }
        
        // Make the element and its parent bold
        var original_href = ui.item.find('a').attr('href');
        var $original = $(this.workspace.el).find('.sidebar')
            .find('a[href="' + original_href + '"]').parent('li');
        $original
            .css({fontWeight: "bold"})
            //.draggable('disable')
            ;
        $original.parents('.parent_dimension')
            .find('.root')
            .css({fontWeight: "bold"});
        
        // Wrap with the appropriate parent element
        if (ui.item.find('a').hasClass('dimension')) {
            
            //var $icon = $("<span />").addClass('sprite');
            if(ui.item.parents('.fields_list').attr('title')=='COLUMNS' || 
            	ui.item.parents('.fields_list').attr('title')=='GROUPS'){
            	var $icon = $("<span />").addClass('sort').addClass('none');
            }
            else{
            	$icon = $("<span />").addClass('sprite');
            }
            
            ui.item.addClass('d_dimension').prepend($icon);
        } else {
            ui.item.addClass('d_measure');
        }
        
        ui.item.css({fontWeight: "normal"});

        // Notify the model of the change
        var dimension = ui.item.find('a').attr('href').replace('#', '');
        var index = ui.item.parent('.connectable').children().index(ui.item);
        
        //ui.item.attr('id', _.uniqueId('col'));
        
        //uid- independent of the dropzone
        ui.item.attr('id', this.workspace.uniqueId('uid-'));
        
        /*
        if(ui.item.parents('.fields_list').attr('title')=='COLUMNS'){
        	ui.item.attr('id', this.workspace.uniqueId('rpt-dtl-'));
        }else if(ui.item.parents('.fields_list').attr('title')=='GROUPS'){
        	ui.item.attr('id', this.workspace.uniqueId('rpt-grp-'));
        }
        */
        

        this.workspace.query.move_dimension(dimension, 
                $(event.target).parent(), index);

      // Prevent workspace from getting this event
        event.stopPropagation();
    },
    
    move_dimension: function(event, ui) {        
        // Notify the model of the change
        var dimension = ui.item.find('a').attr('href').replace('#', '');
        var index = ui.item.parent('.connectable').children().index(ui.item);
        if (! ui.item.hasClass('deleted')) {
            this.workspace.query.move_dimension(dimension, 
                //$(event.target).parent()
                ui.item.parents('.fields_list_body')
                , index);
        }
  
        // Prevent workspace from getting this event
        event.stopPropagation();
        return false;
    },
    
    remove_dimension: function(event, ui) {
        // Reenable original element
        var original_href = ui.draggable.find('a').attr('href');
        var $original = $(this.workspace.el).find('.sidebar')
            .find('a[href="' + original_href + '"]').parent('li');
        $original
            .draggable('enable')
            .css({ fontWeight: 'normal' });
        
        // Unhighlight the parent if applicable
        if ($original.parents('.parent_dimension')
                .children().children('.ui-state-disabled').length === 0) {
            $original.parents('.parent_dimension')
                .find('.root')
                .css({fontWeight: "normal"});
        }
        
        // Notify server
        var target = '';
        var dimension = original_href.replace('#', '');
        $target_el = ui.draggable.parent().parent('div.fields_list_body');

        if ($target_el.hasClass('columns')) target = "COLUMNS";
        if ($target_el.hasClass('group')) target = "GROUP";
        if ($target_el.hasClass('filter')) target = "FILTER";
        
       var index = $target_el.find('li.ui-draggable').index(
                $target_el.find('a[href="#' + dimension + '"]').parent() );
        
        var url = "/" + target + "/" + dimension + "/POSITION/" + index;
        
        var self = this;
        
        this.workspace.query.action.del(url, {
            success: //function(){this.workspace.query.run()}
           
            function(){
            	self.workspace.query.page=null; 
            	self.workspace.query.run();}
        
        });
        
        // Remove element
        ui.draggable.addClass('deleted').remove();
        
        // Prevent workspace from getting this event
        event.stopPropagation();
        event.preventDefault();
        return false;
    },
    
    sort: function(event, ui) {

        var $target = $(event.target).parent().find('.dimension');
            
        var key = $target.attr('href').replace('#', '');
        
        var $li = $target.parent('.ui-draggable');
        var index = $li.parent('.connectable').children().index($li);

        if ($li.parent('.connectable').parent().hasClass('columns')) target = "COLUMNS";
        if ($li.parent('.connectable').parent().hasClass('group')) target = "GROUP";

 		$(event.target).cycleClass(["none","asc,"desc"]);

 		var order = "NONE";	
 		
 		if($(event.target).hasClass("asc")){
 			order = "ASC";
 		}
 		if($(event.target).hasClass("desc")){
 			order = "DESC";
 		}

 		this.workspace.query.action.post("/" + target + "/" + key + "/POSITION/" + index + "/SORT/" + order , { 
            success: this.workspace.query.run
        });
    
    },
    
    selections: function(event, ui) {
        // Determine dimension
        var $target = $(event.target).hasClass('sprite') ?
            $(event.target).parent().find('.dimension') :
            $(event.target);
            
        var key = $target.attr('href').replace('#', '');
        
        var $li = $target.parent('.ui-draggable');
        var index = $li.parent('.connectable').children().index($li);
 
        if($target.parents('.fields_list').attr('title')=='COLUMNS')
		{

        // Launch column config dialog
        (new ColumnConfigModal({
            target: $target,
            index: index,
            name: $target.text(),
            key: key,
            workspace: this.workspace
        })).open();
		}

        if($target.parents('.fields_list').attr('title')=='FILTERS')
		{        
        // Launch selections dialog
        (new SelectionsModal({
            target: $target,
            name: $target.text(),
            key: key,
            workspace: this.workspace
        })).open();
        }
        
        // Prevent default action
        try {
            event.preventDefault();
        } catch (e) { }
        return false;
    }
});