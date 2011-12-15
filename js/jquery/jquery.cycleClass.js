/*
 
 * cycleClass - cycle through an array of classes
 *
 * Copyright (c) 2010 Keith Gould (http://keithgould.tumblr.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 
	Example: $("#linky").cycleClass(["foo","bar","jonez"]);

	Functionality:
	if linky has any of the classes listed in the array
	then all of the classes will be removed, and the class
	after the farthest class found (modulus) will be added.
	
	Scenarios:
	if "foo" found, replace with "bar"
	if "jonez" found, replace with "foo"
	if "bar" and "jonez" found, replace both with "foo"
	if none found, "foo" (first element) added
	
 */

(function( $ ){
  $.fn.cycleClass = function(args) {
		if($.fn.cycleClass.arguments.length == 0) {return this;}
		return this.each(function() {
			var currentObject = $(this);
			var farthestClass = -1;
			var classList = currentObject.attr('class').split(/\s+/);
			$.each(classList, function(index, item){
				var position = $.inArray(item, args);
				if(position > farthestClass){farthestClass = position;}
			});
			if(farthestClass > -1){
				$.each(args,function(index,item) {
					currentObject.removeClass(item)
				});
				nextClass = (farthestClass + 1) % args.length;
				currentObject.addClass(args[nextClass]);
			}else{
				currentObject.addClass(args[0]);
			}
		});
  };
})( jQuery );
