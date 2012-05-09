/*
 * Padrino Javascript Jquery Adapter
 * Created for use with Padrino Ruby Web Framework (http://www.padrinorb.com)
**/

/* Remote Form Support
 * form_for @user, '/user', :remote => true
**/

$("form[data-remote=true]").live('submit', function(e) {
  e.preventDefault(); e.stopped = true;
  var element = $(this);
  var message = element.data('confirm');
  if (message && !confirm(message)) { return false; }
  JSAdapter.sendRequest(element, { 
    verb: element.data('method') || element.attr('method') || 'post', 
    url: element.attr('action'), 
    dataType: element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType) || 'script',
    params: element.serializeArray()
  });
});

/* Confirmation Support
 * link_to 'sign out', '/logout', :confirm => "Log out?"
**/

$("a[data-confirm]").live('click', function(e) {
  var message = $(this).data('confirm');
  if (!confirm(message)) { e.preventDefault(); e.stopped = true; }
});

/* 
 * Link Remote Support 
 * link_to 'add item', '/create', :remote => true
**/

$("a[data-remote=true]").live('click', function(e) {
  var element = $(this); 
  if (e.stopped) return;
  e.preventDefault(); e.stopped = true;
  JSAdapter.sendRequest(element, { 
    verb: element.data('method') || 'get', 
    url: element.attr('href')
  });
});

/* 
 * Link Method Support
 * link_to 'delete item', '/destroy', :method => :delete
**/

$("a[data-method]:not([data-remote])").live('click', function(e) {
  if (e.stopped) return;
  JSAdapter.sendMethod($(e.target));
  e.preventDefault(); e.stopped = true;
});

/* JSAdapter */
var JSAdapter = {
  // Sends an xhr request to the specified url with given verb and params
  // JSAdapter.sendRequest(element, { verb: 'put', url : '...', params: {} });
  sendRequest : function(element, options) {
    var verb = options.verb, url = options.url, params = options.params, dataType = options.dataType;   
    var event = element.trigger("ajax:before");
    if (event.stopped) return false;
    $.ajax({
      url: url,
      type: verb.toUpperCase() || 'POST',
      data: params || [],
      dataType: dataType,

      beforeSend: function(request) { element.trigger("ajax:loading",  [ request ]); },
      complete:   function(request) { element.trigger("ajax:complete", [ request ]); },
      success:    function(request) { element.trigger("ajax:success",  [ request ]); },
      error:      function(request) { element.trigger("ajax:failure",  [ request ]); }
    });
    element.trigger("ajax:after");
  },
  // Triggers a particular method verb to be triggered in a form posting to the url
  // JSAdapter.sendMethod(element);
  sendMethod : function(element) {
    var verb = element.data('method');
    var url = element.attr('href');
    var form = $('<form method="post" action="'+url+'"></form>');
    form.hide().appendTo('body');
    if (verb !== 'post') {
      var field = '<input type="hidden" name="_method" value="' + verb + '" />';
      form.append(field);
    }
    form.submit();
  }
};
/*!
 * jQuery Tools v1.2.6 - The missing UI library for the Web
 * 
 * validator/validator.js
 * 
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * http://flowplayer.org/tools/
 * 
 */
(function(a){a.tools=a.tools||{version:"v1.2.6"};var b=/\[type=([a-z]+)\]/,c=/^-?[0-9]*(\.[0-9]+)?$/,d=a.tools.dateinput,e=/^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i,f=/^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i,g;g=a.tools.validator={conf:{grouped:!1,effect:"default",errorClass:"invalid",inputEvent:null,errorInputEvent:"keyup",formEvent:"submit",lang:"en",message:"<div/>",messageAttr:"data-message",messageClass:"error",offset:[0,0],position:"center right",singleError:!1,speed:"normal"},messages:{"*":{en:"Please correct this value"}},localize:function(b,c){a.each(c,function(a,c){g.messages[a]=g.messages[a]||{},g.messages[a][b]=c})},localizeFn:function(b,c){g.messages[b]=g.messages[b]||{},a.extend(g.messages[b],c)},fn:function(c,d,e){a.isFunction(d)?e=d:(typeof d=="string"&&(d={en:d}),this.messages[c.key||c]=d);var f=b.exec(c);f&&(c=i(f[1])),j.push([c,e])},addEffect:function(a,b,c){k[a]=[b,c]}};function h(b,c,d){var e=b.offset().top,f=b.offset().left,g=d.position.split(/,?\s+/),h=g[0],i=g[1];e-=c.outerHeight()-d.offset[0],f+=b.outerWidth()+d.offset[1],/iPad/i.test(navigator.userAgent)&&(e-=a(window).scrollTop());var j=c.outerHeight()+b.outerHeight();h=="center"&&(e+=j/2),h=="bottom"&&(e+=j);var k=b.outerWidth();i=="center"&&(f-=(k+c.outerWidth())/2),i=="left"&&(f-=k);return{top:e,left:f}}function i(a){function b(){return this.getAttribute("type")==a}b.key="[type="+a+"]";return b}var j=[],k={"default":[function(b){var c=this.getConf();a.each(b,function(b,d){var e=d.input;e.addClass(c.errorClass);var f=e.data("msg.el");f||(f=a(c.message).addClass(c.messageClass).appendTo(document.body),e.data("msg.el",f)),f.css({visibility:"hidden"}).find("p").remove(),a.each(d.messages,function(b,c){a("<p/>").html(c).appendTo(f)}),f.outerWidth()==f.parent().width()&&f.add(f.find("p")).css({display:"inline"});var g=h(e,f,c);f.css({visibility:"visible",position:"absolute",top:g.top,left:g.left}).fadeIn(c.speed)})},function(b){var c=this.getConf();b.removeClass(c.errorClass).each(function(){var b=a(this).data("msg.el");b&&b.css({visibility:"hidden"})})}]};a.each("email,url,number".split(","),function(b,c){a.expr[":"][c]=function(a){return a.getAttribute("type")===c}}),a.fn.oninvalid=function(a){return this[a?"bind":"trigger"]("OI",a)},g.fn(":email","Please enter a valid email address",function(a,b){return!b||e.test(b)}),g.fn(":url","Please enter a valid URL",function(a,b){return!b||f.test(b)}),g.fn(":number","Please enter a numeric value.",function(a,b){return c.test(b)}),g.fn("[max]","Please enter a value no larger than $1",function(a,b){if(b===""||d&&a.is(":date"))return!0;var c=a.attr("max");return parseFloat(b)<=parseFloat(c)?!0:[c]}),g.fn("[min]","Please enter a value of at least $1",function(a,b){if(b===""||d&&a.is(":date"))return!0;var c=a.attr("min");return parseFloat(b)>=parseFloat(c)?!0:[c]}),g.fn("[required]","Please complete this mandatory field.",function(a,b){if(a.is(":checkbox"))return a.is(":checked");return b}),g.fn("[pattern]",function(a){var b=new RegExp("^"+a.attr("pattern")+"$");return b.test(a.val())});function l(b,c,e){var f=this,i=c.add(f);b=b.not(":button, :image, :reset, :submit"),c.attr("novalidate","novalidate");function l(b,c,d){if(e.grouped||!b.length){var f;if(d===!1||a.isArray(d)){f=g.messages[c.key||c]||g.messages["*"],f=f[e.lang]||g.messages["*"].en;var h=f.match(/\$\d/g);h&&a.isArray(d)&&a.each(h,function(a){f=f.replace(this,d[a])})}else f=d[e.lang]||d;b.push(f)}}a.extend(f,{getConf:function(){return e},getForm:function(){return c},getInputs:function(){return b},reflow:function(){b.each(function(){var b=a(this),c=b.data("msg.el");if(c){var d=h(b,c,e);c.css({top:d.top,left:d.left})}});return f},invalidate:function(c,d){if(!d){var g=[];a.each(c,function(a,c){var d=b.filter("[name='"+a+"']");d.length&&(d.trigger("OI",[c]),g.push({input:d,messages:[c]}))}),c=g,d=a.Event()}d.type="onFail",i.trigger(d,[c]),d.isDefaultPrevented()||k[e.effect][0].call(f,c,d);return f},reset:function(c){c=c||b,c.removeClass(e.errorClass).each(function(){var b=a(this).data("msg.el");b&&(b.remove(),a(this).data("msg.el",null))}).unbind(e.errorInputEvent||"");return f},destroy:function(){c.unbind(e.formEvent+".V").unbind("reset.V"),b.unbind(e.inputEvent+".V").unbind("change.V");return f.reset()},checkValidity:function(c,g){c=c||b,c=c.not(":disabled");if(!c.length)return!0;g=g||a.Event(),g.type="onBeforeValidate",i.trigger(g,[c]);if(g.isDefaultPrevented())return g.result;var h=[];c.not(":radio:not(:checked)").each(function(){var b=[],c=a(this).data("messages",b),k=d&&c.is(":date")?"onHide.v":e.errorInputEvent+".v";c.unbind(k),a.each(j,function(){var a=this,d=a[0];if(c.filter(d).length){var h=a[1].call(f,c,c.val());if(h!==!0){g.type="onBeforeFail",i.trigger(g,[c,d]);if(g.isDefaultPrevented())return!1;var j=c.attr(e.messageAttr);if(j){b=[j];return!1}l(b,d,h)}}}),b.length&&(h.push({input:c,messages:b}),c.trigger("OI",[b]),e.errorInputEvent&&c.bind(k,function(a){f.checkValidity(c,a)}));if(e.singleError&&h.length)return!1});var m=k[e.effect];if(!m)throw"Validator: cannot find effect \""+e.effect+"\"";if(h.length){f.invalidate(h,g);return!1}m[1].call(f,c,g),g.type="onSuccess",i.trigger(g,[c]),c.unbind(e.errorInputEvent+".v");return!0}}),a.each("onBeforeValidate,onBeforeFail,onFail,onSuccess".split(","),function(b,c){a.isFunction(e[c])&&a(f).bind(c,e[c]),f[c]=function(b){b&&a(f).bind(c,b);return f}}),e.formEvent&&c.bind(e.formEvent+".V",function(a){if(!f.checkValidity(null,a))return a.preventDefault();a.target=c,a.type=e.formEvent}),c.bind("reset.V",function(){f.reset()}),b[0]&&b[0].validity&&b.each(function(){this.oninvalid=function(){return!1}}),c[0]&&(c[0].checkValidity=f.checkValidity),e.inputEvent&&b.bind(e.inputEvent+".V",function(b){f.checkValidity(a(this),b)}),b.filter(":checkbox, select").filter("[required]").bind("change.V",function(b){var c=a(this);(this.checked||c.is("select")&&a(this).val())&&k[e.effect][1].call(f,c,b)});var m=b.filter(":radio").change(function(a){f.checkValidity(m,a)});a(window).resize(function(){f.reflow()})}a.fn.validator=function(b){var c=this.data("validator");c&&(c.destroy(),this.removeData("validator")),b=a.extend(!0,{},g.conf,b);if(this.is("form"))return this.each(function(){var d=a(this);c=new l(d.find(":input"),d,b),d.data("validator",c)});c=new l(this,this.eq(0).closest("form"),b);return this.data("validator",c)}})(jQuery);
/**
 * jQuery.labelify - Display in-textbox hints
 * Stuart Langridge, http://www.kryogenix.org/
 * Released into the public domain
 * Date: 25 June 2008
 * Last update: 08 September 2008
 * @author Stuart Langridge
 * @author Garrett LeSage
 * @version 2.0
 */

/**
 * Defaults to taking the in-field label from the field's title attribute
 * @example $("input").labelify();
 * @param {object|string} [settings] optional parameters to pass
 * @config {string} [text] "title" to use the field's title attribute (default),
 *                         "label" to use its <label> (for="fieldid" must be specified)
 * @config {string} [labeledClass] class applied to the field when it has label text
 *
 * @example $('input').labelify('hasLabel'); // return true if the field has a label
 */
jQuery.fn.labelify = function(settings) {
  // if the element has a label, return true when 'hasLabel' is passed as an arg
  if (typeof settings === 'string' && settings === 'hasLabel') {
    return $(this).data('hasLabel');
  }

  settings = jQuery.extend({
    text: 'title',
    labeledClass: ''
  }, settings);

  // Compatibility with version 1.3 and prior (double-ls)
  if (settings.labelledClass) { settings.labeledClass = settings.labelledClass; }

  var showLabel, hideLabel,
      lookups, lookup,
      $labelified_elements;

  lookups = {
    title: function(input) {
      return $(input).attr('title');
    },
    label: function(input) {
      return $("label[for=" + input.id +"]").text();
    }
  };

  $labelified_elements = $(this);

  showLabel = function(el){
    $(el).data('value', el.value);
    el.value = $(el).data("label");
    $(el).addClass(settings.labeledClass).data('hasLabel', true);
  };
  hideLabel = function(el){
    el.value = $(el).data('value');
    $(el).removeClass(settings.labeledClass).data('hasLabel', false);
  };

  return $(this).each(function() {
    var $item = $(this),
        removeValuesOnExit;

    if (typeof settings.text === 'string') {
      lookup = lookups[settings.text]; // what if not there?
    } else {
      lookup = settings.text; // what if not a fn?
    }

    // bail if lookup isn't a function or if it returns undefined
    if (typeof lookup !== "function" || !lookup(this)) { return; }

    $item.bind('focus.label',function() {
      if (this.value === $(this).data("label")) { hideLabel(this); }
    }).bind('blur.label',function(){
      if (this.value == '') { showLabel(this); }
    });
    $item.data('label', lookup(this).replace(/\n/g,'')) // strip label's newlines
    $item.data('value', this.value); // initialise remembered value
    
    removeValuesOnExit = function() {
      $labelified_elements.each(function(){
        if (this.value === $(this).data("label")) { hideLabel(this); }
      });
    };
    
    $item.parents("form").submit(removeValuesOnExit);
    $(window).unload(removeValuesOnExit);
    
    if (this.value !== this.defaultValue || this.defaultValue != '') {
      // user already started typing; don't overwrite their work!
      // also, if a value is already set in the field, don't replace it
      // with a label
      return;
    }

    // set the defaults
    showLabel(this);
  });
};

/**
*	@preserve jQuery password123: iPhone Style Passwords Plugin - v1.5 - 2/1/2011
*	http://timmywillison.com/samples/password123/
*	Copyright (c) 2011 timmy willison
*	Dual licensed under the MIT and GPL licences.
*	http://timmywillison.com/licence/
*/

// *Version: 1.5, Last updated: 2/1/2011*
// 
// Demo			- http://timmywillison.com/samples/password123/
// Testing		- http://timmywillison.com/samples/password123/qunit/test/
// GitHub		- http://github.com/timmywil/password123
// Source		- http://github.com/timmywil/password123/raw/master/jquery.password123.js (13.8kb)
// (Minified)	- http://github.com/timmywil/password123/raw/master/jquery.password123.min.js (5.2kb)
// 
// License
// 
// Copyright (c) 2011 timmy willison,
// Dual licensed under the MIT and GPL licenses.
// http://timmywillison.com/licence/
// 
// Support and Testing
// 
// Versions of jQuery and browsers this was tested on.
// 
// jQuery Versions - 1.3.2-1.5
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.7, Safari 3-5,
//					 Chrome 4-6, Opera 9.6-10.5.
// 
// Release History
// 
// 1.5   - (2/1/2011) Added widget-style option method, only instantiate when not calling a method
// 1.4	 - (2/1/2011) Restructured plugin, added destroy method, added tests
// 1.3	 - (11/23/2010) Added Google Closure Compiler comments, common password field attribute
//				support when replacing fields, and no longer sends placeholder value when submitting the form.
// 1.2	 - (9/28/2010) Placeholders changed to only work with HTML5 placeholder attribute, 
//				'value' attribute now reserved for actual values
// 1.1	 - (7/5/2010) Add Placeholder functionality
// 1.0	 - (7/4/2010) Initial release
//
// See README for usage and placeholder explanation

;(function ($, window, document, undefined) {
	
	// Extend jQuery
	$.fn.password123 = function ( options ) {
		var instance = $.data( this[0], "password123" ),
			args = Array.prototype.slice.call( arguments, 1 );

		// Catch method calls
		if ( !!instance && typeof options === "string" && options.charAt( 0 ) !== "_" && instance[ options ] ) {
			args.unshift( this );
			return instance[ options ].apply( instance, args );
		}
		
		return this.map(function( i, elem ) {
			// Returns the new password fields for chaining
			// Old password fields are removed
			return new password123._init( elem, options );
		});
	};
	
	var clear_timeout = window.clearTimeout,
		counter = 0,
	password123 = {
		
		_init: function( elem, options ) {
			
			// Catch fields that aren't password fields
			if ( !elem.type === "password" ) {
				return elem;
			}
			
			var self = this;
			
			// Continue regularly
			self.options = $.extend({

				// You can use any html character code or
				// plain text character
				character: "&#8226;",

				// This is the delay(ms) for when the last
				// character will change
				delay: 2000,

				// Use any prefix you like for the new
				// field ids, but they will always be zero-indexed
				prefix: "iField",

				// Enable the override of the placeholder attribute
				placeholder: true,

				// With this classname, you can set placeholder
				// specific styles in your own css
				placeholderClass: 'place',

				// When true, this will mask the placeholder or initial value
				maskInitial: false
			}, options);
			
			// HTML encode the character
			self.encodedChar = $('<div>'+ self.options.character +'</div>').text();
			
			// Replace the fields with what we need
			// and store in var fields
			self.$field = self._replaceField( elem )
			
				// Bind textchange to the fields with
				// the letterChange function
				.bind('textchange', function() {
					self._letterChange.call( self );
				});
			
			
			// Add placeholder stuff
			if ( self.options.placeholder ) {
				self._bindPlaceholder();
			}

			// Mask the placeholder or initial value if needed
			if ( self.options.maskInitial ) {
				self.$field.keyup();
			}
			
			// Return the new password field
			return self.$field[0];
		},
		
		/**
		 * Replaces the password field with a hidden field
		 * and adds the new visible text field.
		 * @param {object} $field One field to replace
		 * @return {object} The new text field.
		 * @private
		 */
		_replaceField: function( field ) {
			var	self     = this,
				$field   = $(field),
				place    = $field.attr('placeholder') || undefined,
				field_id = self.options.prefix + counter++,
				value    = $field.val() || ( self.options.placeholder ? place || '' : '' ),
				classes  = self.options.placeholder && place !== undefined && (value === place || value === '') ?
								field.className + ' ' + self.options.placeholderClass :
								field.className,
				attrs = { 'class': classes, 'id': field_id, 'value': value, 'placeholder': self.options.placeholder ? undefined : place },
				standards = [ 'size', 'tabindex', 'readonly', 'disabled', 'maxlength' ];

			// Combine attrs with standard attrs
			for ( var i = 0; i < standards.length; i++ ) {
				var attr = $field.attr( standards[i] );
				attrs[ standards[i] ] = attr && attr > -1 ? attr : undefined;
			}

			// The hidden field that will get sent with the form
			self.$hidden = $('<input type="hidden"/>')
				.attr({
					'name': $field.attr('name'),
					'id': field.id,
					'class': field.className,
					'disabled': $field.attr('disabled')
				})
				.replaceAll( $field )
				.val( value !== place ? value : '' );
			
			self.$oldField = $field;
			
			// The main field
			return $('<input type="text"/>')
				.attr( attrs )
				.insertAfter( self.$hidden )
				.data({
					'value': $field.val() || '', // If value was set, fill it in correctly
					'placeholder': place, // Attach placeholder for comparison to value
					'newVal': value, // This to avoid sending the placeholder value when submitting the form
					'password123': self // Attach the instance of this plugin
				});
		},

		/**
		 * Calls for the necessary adjustments when
		 * a field is changed
		 * @private
		 */
		_letterChange: function( elem ) {
			var fv = this.$field.val();

			if ( fv.length > this.$field.data('value').length ) {

				// Apply fieldChange as normal
				this.$field.data( 'value', this._fieldChange() );

			} else if ( fv.length < this.$field.data('value').length ) {

				// Clear the timeout for the last character
				clear_timeout( this.last );

				var old = this.$hidden.val(),
					newVal;

				if ( fv.length < old.length - 1 ) {
					newVal = old.substr( 0, fv.length );
				} else {
					var cp = this._getCursorPosition();

					// Create the new value with the correct
					// character deleted
					newVal = old.length > cp + 1 && cp > -1 
						? old.slice(0, cp).concat(old.slice(cp + 1)) 
						: old.slice(0, cp);
				}

				// Update data and the hidden input
				this.$field.data({ 'value': fv, 'newVal': newVal });
				if ( newVal !== this.$field.data('placeholder') ) {
					this.$hidden.val( newVal );
				}
			}
			
			return this;
		},

		/**
		 * Updates the field with the dots as the user types,
		 * and sets the timeout for the last char.
		 * @return {string} The new value to set to field.data
		 * @private
		 */
		_fieldChange: function() {
			var self = this;
			
			// Clear the timeout for the last character
			clear_timeout( self.last );
			var fv = self.$field.val(), len = fv.length,
				old = self.$hidden.val(),
				cp = self._getCursorPosition(),
				newVal;

			// Update the hidden value with the correct value
			// depending on cursor position
			newVal = old.length > cp + 1 && cp > -1 
				? old.substr(0, cp-1) + fv.charAt(cp-1) + old.substr(cp-1)
				: old + fv.charAt(len - 1);
			self.$field.data('newVal', newVal);
			if ( newVal !== self.$field.data('placeholder') ) {
				self.$hidden.val( newVal );
			}

			if ( len > 1 ) {

				// Loop through and change all characters
				for ( var i = 0; i < len - 1; i++ ) {
					fv = fv.replace( fv.charAt(i), self.encodedChar );
				}

				// Update the field
				self.$field.val( fv );
			}
			if ( len > 0 ) {

				// Set the timeout for the last character
				self.last = setTimeout(function () {
					cp = self._getCursorPosition();
					fv = self.$field.val();
					fv = fv.replace( fv.charAt(len - 1), self.encodedChar );
					self.$field.val( fv ).data('value', fv);

					// Reset cursor position to what it was if not at end
					if ( cp != len ) {
						self._setCursorPosition( cp );
					}
				}, self.options.delay);
			}

			// Reset cursor position to what it was if not at end
			if ( cp != len ) {
				self._setCursorPosition( cp );
			}
			return fv;
		},

		/**
		 * Placeholder functionality
		 * @private
		 */
		_bindPlaceholder: function() {
			var self = this,
				place = self.$field.data('placeholder');

			if ( place !== undefined ) {
				self.$field.bind({
					"focus.password123": function() {
						// Compare the hidden value with the placeholder value
						if ( self.$field.data('newVal') === place ) {
							self.$field.val('').removeClass( self.options.placeholderClass ).data( 'newVal', '' );
							self.$hidden.val('');
						}
					},
					"blur.password123": function() {
						// If it's empty, put the placeholder in as the value
						if ( place !== undefined && self.$field.val() === '' ) {
							self.$field.val( place ).addClass( self.options.placeholderClass ).data( 'newVal', place );

							// Mask the placeholder if needed
							if ( self.options.maskInitial ) {
								self.$field.keyup();
							}
						}
					}
				});
			} else {
				self.$field.keyup();
			}
			return self;
		},
		
		/**
		 * Remove placeholder functionality
		 * @private
		 */
		_changePlaceholder: function( isPlace ) {
			if ( isPlace && !this.options.placeholder ) {
				return this._bindPlaceholder();
			} else if ( !isPlace && this.options.placeholder ) {
				this.$field.focus().unbind('.password123').blur();
			}
			return this;
		},
		
		/**
		 * Change the id prefix on this field
		 * @private
		 */
		_changePrefix: function( value ) {
			var cur = this.$field.attr("id"),
				prev = this.options.prefix;
			this.$field.attr( 'id', cur.replace( prev, value ) );
			return this;
		},
		
		/**
		 * Gets the current cursor position in a textfield
		 * to determine where to delete/update a character.
		 * @return {Number} The index for the position of the cursor. 
		 * @private
		 */
		_getCursorPosition: function() {
			var elem = this.$field[0];
			if ( elem != null ) {
				// IE
				if ( document.selection ) {
					elem.focus();
					var sel = document.selection.createRange();
					sel.moveStart( 'character', -elem.value.length );
					return sel.text.length;
				}
				// Others
				else if ( elem.selectionStart !== undefined ) {
					return elem.selectionStart;
				}
			}
			return -1;
		},

		/**
		 * Sets the cursor position to a previous state
		 * if the field was updated somewhere in the middle.
		 * @param {Element} field The raw field.
		 * @param {Number} pos The position to set to.
		 * @private
		 */
		_setCursorPosition: function( pos ) {
			var elem = this.$field[0];
			if ( elem != null ) {
				// IE
				if ( elem.createTextRange ) {
					var range = elem.createTextRange();
					range.move('character', pos);
					range.select();
				}
				// Others
				else if ( elem.setSelectionRange ) {
					elem.focus();
					elem.setSelectionRange( pos, pos );
				}
				else {
					elem.focus();
				}
			}
		},
		
		/**
		 * Internally sets options
		 * @return password123 instance
		 * @private
		 */
		_setOptions: function( options ) {
			var self = this;
			$.each( options, function( key, value ) {
				switch ( key ) {
					case "placeholder":
						self._changePlaceholder( value === "false" ? false : value );
						break;
					case "prefix":
						self._changePrefix( value );
				}
				self.options[ key ] = value;
			});
			return this;
		},
		
		/**
		 * Destroys everything password123 has done and
		 * sets the original password field back in place
		 * @return The original password field
		 */
		destroy: function( elem ) {
			var val = this.$hidden.remove().val();
			return this.$oldField.val( val ).replaceAll( elem );
		},
		
		/**
		 * Get/set option on an existing password123 instance
		 * @return The password123 field
		 */
		option: function( elems, key, value ) {
			if ( !key ) {
				return $.extend( {}, this.options ); // Avoids returning direct reference
			}
			var options = key;
			
			if ( typeof key === "string" ) {
				if ( value === undefined ) {
					return this.options[ key ];
				}
				options = {};
				options[ key ] = value;
			}

			this._setOptions( options );

			return elems;
		}
	};
	password123._init.prototype = password123;
	
	// Textchange event with a little extra
	$.event.special.textchange = {
		setup: function( data, namespaces ) {
			$(this).bind('keyup.textchange', $.event.special.textchange.handler);
			$(this).bind('cut.textchange paste.textchange input.textchange', $.event.special.textchange.delayedHandler);
		}, 
		teardown: function( namespaces ) {
			$(this).unbind('.textchange');
		}, 
		handler: function( event ) {
			$.event.special.textchange.triggerIfChanged( $(this) );
		}, 
		delayedHandler: function( event ) {
			var $element = $(this);
			
			setTimeout(function() {
				$.event.special.textchange.triggerIfChanged( $element );
			}, 25);
		}, 
		triggerIfChanged: function( $element ) {
			var v = $element.val();
			
			if ( $element.val() !== $element.data('lastValue') ) {
				
				// Check if something larger than one letter was pasted into the field
				var p123 = $.data( $element[0], "password123" );
				if ( v.length > 1 && v.indexOf( p123.encodedChar ) === -1 ) {
					
					// If so, we need to save it before it disappears,
					// but continue with triggering the field change
					// by taking the last letter off
					v = v.substr(0, v.length-1);
					$element.data('value', v);
					p123.$hidden.val( v );
				}
				$element.trigger( 'textchange', $element.data('lastValue') );
				$element.data('lastValue', $element.val());
			}
		}
	};
	

})(jQuery, this, this.document);

(function() {

  (function($) {
    $.formsSuck = function(el, options) {
      var _this = this;
      this.$form = $(el);
      this.$form.data("formsSuck", this);
      this.init = function() {
        _this.options = $.extend({}, $.formsSuck.defaultOptions, options);
        return _this;
      };
      this.init();
      this.$form.children('input:not(:password)').labelify({
        text: "label"
      });
      this.$form.children('input:password').password123();
      this.validator = this.$form.validate();
      $form.fn.extend({
        showError: function(message) {
          var error_html;
          error_html = $.parseTMPL('form_error', {
            message: message
          });
          return error_html.append_to($form).fadeIn(300);
        }
      });
      $form.children('fieldset').each(function(step) {
        var fieldset_html;
        fieldset_html = $.parseTMPL('step', {
          fields: $(step).children('input, textarea').html
        }, {
          title: $(step).children('.title').html,
          desc: $(step).children('.desc').html
        });
        step.remove;
        return fieldset_html.append_to($form);
      });
      this.$form.live("ajax:failure", function(event, xhr, status) {
        var response;
        response = $.parseJSON(xhr.responseText);
        if ($.isPlainObject(response)) {
          if (response.errors) {
            return this.validator.showErrors(response.errors);
          } else if (response.message) {
            return this.$form.showError(response.message);
          } else if (response.status === 'fail') {
            return this.validator.showErrors(response.data);
          } else {
            return this.$form.showError(this.options.default_error);
          }
        }
      });
      this.$form.live("ajax:success", function(event, xhr, status) {
        var response;
        response = $.parseJSON(xhr.responseText);
        if (this.options.redirect_url === location) location.reload;
        return location(this.options.redirect_url);
      });
      return {
        parseTMPL: function(template, data) {
          var parsed;
          parsed = '';
          if ($("[name=" + template + "]")) {
            parsed = $("[name=" + template + "]").tmpl(data);
          } else if ($.tmpl('views/#{template}')) {
            parsed = $.tmpl('views/#{template}')(data);
          } else {
            $.get("settings.template_path/" + template, function(response) {
              return parsed = $.tmpl(response, data);
            });
          }
          return parsed;
        }
      };
    };
    $.formsSuck.defaultOptions = {
      autocomplete: 'off',
      lang: 'en',
      redirect_url: location,
      templates_path: 'templates',
      default_error: 'Form submission failed'
    };
    return $.fn.formsSuck = function(options) {
      return $.each(this, function(i, el) {
        var $el;
        $el = $(el);
        if (!$el.data('formsSuck')) {
          return $el.data('formsSuck', new $.formsSuck(el, options));
        }
      });
    };
  })(jQuery);

}).call(this);
