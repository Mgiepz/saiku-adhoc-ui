// jQuery File Tree Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// Visit http://abeautifulsite.net/notebook.php?article=58 for more information
//
// Usage: $('.fileTreeDemo').fileTree( options, callback )
//
// Options:  root           - root folder to display; default = /
//           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
//           folderEvent    - event to trigger expand/collapse; default = click
//           expandSpeed    - default = 500 (ms); use -1 for no animation
//           collapseSpeed  - default = 500 (ms); use -1 for no animation
//           expandEasing   - easing function to use on expand (optional)
//           collapseEasing - easing function to use on collapse (optional)
//           multiFolder    - whether or not to limit the browser to one subfolder at a time
//           loadMessage    - Message to display while initial tree loads (can be HTML)
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// TERMS OF USE
// 
// jQuery File Tree is licensed under a Creative Commons License and is copyrighted (C)2008 by Cory S.N. LaViska.
// For details, visit http://creativecommons.org/licenses/by/3.0/us/
//
// JSON modification by Claudiu Bischoff for Miva Scrip Community :-)
// More infos: http://mivascript.org/share/
//
if(jQuery) (function($){
	
	$.extend($.fn, {
		fileTree: function(o, h) {
			// Defaults
			if( !o ) var o = {};
			if( o.root == undefined ) o.root = '/';
			if( o.script == undefined ) o.script = 'jqueryFileTree.php';
			if( o.folderEvent == undefined ) o.folderEvent = 'click';
			if( o.expandSpeed == undefined ) o.expandSpeed= 500;
			if( o.collapseSpeed == undefined ) o.collapseSpeed= 500;
			if( o.expandEasing == undefined ) o.expandEasing = null;
			if( o.collapseEasing == undefined ) o.collapseEasing = null;
			if( o.multiFolder == undefined ) o.multiFolder = true;
			if( o.loadMessage == undefined ) o.loadMessage = 'Loading...';
			othervars = '';;
			$(this).each( function() {
				
				function showTree(c, t) {
					$(c).addClass('wait');
					$(".jqueryFileTree.start").remove();					
					caller = o.script+"?dir="+t+othervars;
					$.getJSON(caller, function(ret) {
						data = moveData(ret,o);
						$(c).find('.start').html('');
						$(c).removeClass('wait').append(data);
						if( o.root == t ) $(c).find('UL:hidden').show(); else $(c).find('UL:hidden').slideDown({ duration: o.expandSpeed, easing: o.expandEasing });
						bindTree(c);
					});
				}
				
				function bindTree(t) {
					$(t).find('LI A').bind(o.folderEvent, function() {
						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {
								// Expand
								if( !o.multiFolder ) {
									$(this).parent().parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
									$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
								}
								$(this).parent().find('UL').remove(); // cleanup
								othervars = $(this).attr('othervars');
								showTree( $(this).parent(), escape($(this).attr('rel').match( /.*\// )) );
								$(this).parent().removeClass('collapsed').addClass('expanded');
							} else {
								// Collapse
								$(this).parent().find('UL').slideUp({ duration: o.collapseSpeed, easing: o.collapseEasing });
								$(this).parent().removeClass('expanded').addClass('collapsed');
							}
						} else {							
							h($(this).attr('rel'));							
						}
						return false;
					});
					// Prevent A from triggering the # on non-click events
					if( o.folderEvent.toLowerCase != 'click' ) $(t).find('LI A').bind('click', function() { return false; });
				}
				
				function moveData(ret,d){
					var ext = '';html = "";var icon = '';
					var html_s = '<ul class="jqueryFileTree" style="display: none;">';
					var html_e = '</ul>';
					$.each(ret.items, function(i,item){
						var ext = item.ext;
						var file = item.name;
						// if we want to pass other vars to our connector, here is the place to do it
						var parent = item.parent;
						var level = item.level;
						var icon = item.icon;
						if( icon ){
						   var icn_style = 'txt" style="background: url('+icon+') left top no-repeat;';
						 }
						else {
						   var icn_style = ext;
						 }						
						orthervars = "&parent="+parent+"&level="+level;
						if( ext ){ // it's a file :-)
							html = html+'<li class="file ext_'+icn_style+'"><a href="#" rel="'+parent+'" othervars="'+orthervars+'">'+file+'</a></li>';
						 }
						else { // it's a directory :-) 							
							html = html+'<li class="directory collapsed"><a href="#" rel="'+parent+'/"  othervars="'+orthervars+'">'+file+'</a></li>';
						}
					});
					var html = html_s+html+html_e;return html;
				}
				
				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + o.loadMessage + '<li></ul>');
				// Get the initial file list
				showTree( $(this), escape(o.root) );
			});
		}
	});
})(jQuery);