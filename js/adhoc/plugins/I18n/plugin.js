/*
 * plugin.js
 * 
 * Copyright (c) 2011, OSBI Ltd. All rights reserved.
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
 * The user's current locale
 */
Application.i18n = {
    locale: (navigator.language || navigator.browserLanguage || 
        navigator.systemLanguage || navigator.userLanguage).substring(0,2).toLowerCase(),
    po_file: {},
    translate: function() {
        $('.i18n').i18n(Application.i18n.po_file);
    },
    automatic_i18n: function() {
        // Load language file if it isn't English
        if (Application.i18n.locale != "en") {
            $.ajax({
                url: "js/adhoc/plugins/I18n/po/" + Application.i18n.locale + ".json",
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    Application.i18n.po_file = data;
                    Application.i18n.translate();
                }
            });
        }
        
        return true;
    },
    elements: [],
    improve_translation: function() {
        Application.tabs.add(new TranslationTab());
        return false;
    }
};

/**
 * jQuery plugin for i18n
 */
(function( $ ){
	/**
	 * Internationalize selected elements with the provided PO file
	 */
	$.fn.i18n = function(po_file) {
		// If no PO file is provided, then don't translate anything
		if (! po_file)
			return this;
		
		// If key is not found, return original language
		var translate = function(key, po_file) {
			if (typeof po_file[key] == "undefined") {
				return "";
			} else {
				return po_file[key];
			}
		};		

		// Iterate over UI elements that need to be translated
		return $.each(this, function() {
			element = $(this);
			
			// Translate text
			if (element.html()) {
				translated_text = translate( element.html(), po_file );
                if (Application.i18n.elements.indexOf &&
                    Application.i18n.elements.indexOf(element.html()) === -1) {
                    Application.i18n.elements.push(element.html());
                }
				if (translated_text) {
					element.data('original', element.html());
					element.html(translated_text);
					element.removeClass('i18n');
				}
			}
			
			// Translate title
			if (element.attr('title')) {
				translated_title = translate( element.attr('title'), po_file );
                if (Application.i18n.elements.indexOf && 
                    Application.i18n.elements.indexOf(element.attr('title')) === -1) {
                    Application.i18n.elements.push(element.attr('title'));
                }
				if (translated_title) {
					element.data('original', element.attr('title'));
					element.attr({ 'title': translated_title });
					element.removeClass('i18n');
				}
			}
			
			// Remove class so this element isn't repeatedly translated
			if (element.hasClass('i18n')) {
			    element.addClass('i18n_failed');
			}
			element.addClass('i18n_translated');
		});
	};
	
	$.fn.un_i18n = function() {
		// Iterate over UI elements to replace the original text
		return $.each(this, function() {
			element = $(this);
			
			if (element.text())
				element.text(element.data('original'));
			
			if (element.attr('title'))
				element.attr({ 'title': element.data('original') });
			
			element.addClass('i18n');
			element.removeClass('i18n_translated')
			    .removeClass('i18n_failed');
		});
	};
})( jQuery );

/**
 * Backbone view which allows users to submit translations
 */
var TranslationTab = Backbone.View.extend({
    className: 'workspace_area',
    caption: function() {
        return Application.i18n.po_file["Improve this translation"] ?
            Application.i18n.po_file["Improve this translation"] :
            "Improve this translation";
    },
    events: {
        'submit form': 'submit',
        'change input': 'mark'
    },
    initialize: function() {
        $(window).resize(this.adjust);
        $(this.el).focus(this.adjust);
        this.adjust();
    },
    render: function() {
        var translation_table = {};
        for (var i = 0; i < Application.i18n.elements.length; i++) {
            translation_table[Application.i18n.elements[i]] = {
                value: Application.i18n.po_file[Application.i18n.elements[i]],
                name: encodeURI(Application.i18n.elements[i])
            };
        }
        var table = _.template("<form class='workspace_results'>" +
        	"Your name: <input type='text' name='translator_name' />" +
            "<p>Please fill in the appropriate translation in the blanks provided:<p>" +
        	"<% _.each(translation_table, function(val, key) { %>" +
            "<div><b><%= key %></b><br />" +
            "<input type='text' value='<%= val.value %>' name='<%= val.name %>' />" +
            "</div>" +
            "<% }); %>" +
            "<div><input class='submit-translation' type='submit' value='Submit translation' /></div>" +
            "</form>")({
                translation_table: translation_table
            });
        $(this.el).html(table).find('div').css({
            'float': 'left',
            'padding': '20px'
        }).find('input').css({
            'width': '300px'
        });
        $(this.el).find('.submit-translation').css({
            'padding': '20px'
        });
    },
    
    mark: function(event) {
        $(event.target).addClass('changed');
    },
    
    submit: function() {
        var translation = { locale: Application.i18n.locale };
        $(this.el).find('.changed').each(function(element) {
            translation[decodeURI($(this).attr('name'))] = encodeURI($(this).val());
        });
        Translate.log(translation);
        Application.ui.block('Thank you for improving our translation!');
        this.tab.remove();
        _.delay(function() {
            Application.ui.unblock();
        }, 1000);
        return false;
    },
    
    adjust: function() {
        $(this.el).height($("body").height() - 87);
    }
});

/**
 * Automatically internationalize the UI based on the user's locale
 */
Application.i18n.automatic_i18n();

/** 
 * Add translate button
 */
Application.events.bind('toolbar:render', function(args) {
    if (Application.i18n.locale != "en") {
        var $link = $("<a />").text(Application.i18n.locale)
            .attr({ 
                href: "#translate",
                title: "Improve this translation"
            })
            .click(Application.i18n.improve_translation)
            .addClass('sprite translate i18n');
        var $li = $("<li />").append($link);
        $(args.toolbar.el).find('ul').append($li);
    }
});

/**
 * Bind to new workspace
 */
Application.events.bind('session:new', function() {    
    // Translate elements already rendered
    Application.i18n.translate();
    
    // Translate new workspaces
    Application.session.bind('tab:add', Application.i18n.translate);
});

/**
 * Initialize Loggly input for user-provided translations
 */
if (window.logger) {
    window.Translate = new logger({ 
        url: Settings.TELEMETRY_SERVER + '/input/translations'
    });
}
