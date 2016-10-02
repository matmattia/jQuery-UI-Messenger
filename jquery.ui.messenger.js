/**
* jQuery UI Messenger
* @name jquery.ui.messenger.js
* @author Mattia - http://www.matriz.it
* @version 1.0.4
* @date September 16, 2016
* @category jQuery plugin
* @copyright (c) 2016 Mattia at Matriz.it (info@matriz.it)
* @license MIT - http://opensource.org/licenses/mit-license.php
* @example Visit http://www.matriz.it/projects/jquery-ui-messenger/ for more informations about this jQuery plugin
*/
(function ($) {
	$.extend({
		'messenger': function (method, options) {
			var methods = {
				'base': function (options) {
					var default_options = {
							'type': 'info',
							'dialogClass': 'ui-messenger ui-messenger-{TYPE}',
							'html': '<p><span class="ui-icon ui-icon-{TYPE}" style="float:left;"></span> {TEXT}</p>'
						},
						div = $('<div />');
					options = $.extend(default_options, options);
					options.dialogClass = options.dialogClass.replace(/\{TYPE\}/g, options.type);
					div.html(options.html.replace(/\{TEXT\}/g, options.text).replace(/\{TYPE\}/g, options.type)).dialog(options);
					return this;
				},
				'success': function (options) {
					var default_options = {
						'dialogClass': 'ui-messenger ui-messenger-success'
					};
					options = $.extend(default_options, options);
					options.type = 'check';
					return methods.base(options);
				},
				'error': function (options) {
					var default_options = {
							'dialogClass': 'ui-messenger ui-messenger-error ui-state-error',
							'html': '<p class="ui-state-error-text"><span class="ui-icon ui-icon-alert" style="float:left;"></span> {TEXT}</p>'
						},
						div = $('<div />');
					options = $.extend(default_options, options);
					options.autoOpen = false;
					div.html(options.html.replace(/\{TEXT\}/g, options.text)).dialog(options);
					div.dialog('widget').find('.ui-widget-header .ui-dialog-title').addClass('ui-state-error-text');
					div.dialog('open');
					return this;
				},
				'prompt': function (options) {
					var default_options = {
							'dialogClass': 'ui-messenger ui-messenger-prompt',
							'buttonOkText': 'OK',
							'buttonCancelText': 'Cancel',
							'html': '<p>{TEXT}</p><div>{INPUT}</div>',
							'value': ''
						},
						inp = $('<input />'),
						div = $('<div />'),
						callbackPrompt = $.noop,
						promptFocus = function (e) {
							if (e.keyCode === 13) {
								callbackPrompt(true);
							}
						};
					options = $.extend(default_options, options);
					options.autoOpen = false;
					options.beforeClose = function (e) {
						if (!$(e.target).data('closed')) {
							callbackPrompt(false, null);
						}
					};
					inp.attr({
						'type': 'text',
						'name': 'prompt',
						'value': options.value
					}).addClass('prompt_text ui-widget-content ui-corner-all');
					div.html(options.html.replace(/\{TEXT\}/g, options.text).replace(/\{INPUT\}/g, $('<p />').append(inp.clone()).html())).dialog(options);
					callbackPrompt = function (close, val) {
						var is_undefined = typeof val === 'undefined',
							is_null = !is_undefined && val === null;
						if (is_null) {
							if (options.callbackCancel && $.isFunction(options.callbackCancel)) {
								options.callbackCancel.call(this);
							}
						} else if (options.callback && $.isFunction(options.callback)) {
							options.callback.call(this, is_undefined ? div.find('input.prompt_text').val() : val);
						}
						if (close) {
							div.data('closed', true);
							div.dialog('close');
						}
					};
					if (!options.buttons) {
						div.dialog('option', 'buttons', [
							{
								'text': options.buttonOkText,
								'click': function () {
									callbackPrompt(true);
								}
							},
							{
								'text': options.buttonCancelText,
								'click': function () {
									callbackPrompt(true, null);
								}
							}
						]);
					}
					div.find('input[name=prompt]').keydown(promptFocus).focus();
					div.dialog('open');
					return this;
				}
			};
			return methods[method] ? methods[method].call(this, options) : this;
		}
	});
})(jQuery);