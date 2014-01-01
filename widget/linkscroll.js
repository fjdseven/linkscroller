/*
 *	AUTHOR: Mottaqui Karim; @the_taqquikarim
 */
;(function ( $, window, document, undefined ) {

	// VERY simple link scrolling js component
	// REQUIRES: jquery, jqueryui, history.js
	// VERY few options available - you may:
	// 		specify which element to select for 
	// 		specify which events to fire on
	// 		specify what the data- attribute that serves as the 'key' is
	//		specify a callback that fires after animation is complete
	//		specify a callback that fires before animation starts

	var __PROTOTYPE__ = {
		options: {
			linkSelector    :    'a'			// the selector to look for in self.element
			, linkEvent     :    'click'			// react only when this (these) event(s) occur
			, linkDataAttr  :    'data-anchor'		// grab the key from this data-attr
			, onBeforeAnim  :    -1				// fired right before animation starts
			, onAfterAnim   :    -1				// fired right after animation states
		}

		// this is the event that fires History code 
		// History keeps track of browser history and takes advantage of 
		// HTML5 popstate and pushstate API to animate AND update URL bar
		, __STATE_EVENT__: 'statechange'	// TODO: turn this to option

		, _create: function() {
			// METHOD: set up the click event for the linkSelector
			// wire up History methods
			var self = this;
			
			// handle the linkSelectors
			self.el = $( self.element );
			self.initLinkHandlers();

			// our first step is to bind the statechange event
			// for the History object
			self._initStateChange()
		}

		, _initStateChange: function() {
			// state change for History obj
			var self = this;

			// PRIVATE METHOD: parse a URL by the '/'s 
			// return the last item in array
			var __PARSE_URI__ = function(    url   ) {
				return '#'    +    url.split(    /\//    ).pop();
			}

			// PRIVATE METHOD: callback that gets fired 
			// after the __STATE_EVENT__ event is fired
			var __STATE_CALLBACK__ = function() {
				var     state    	=    History.getState()				// get current State object ( this is URL bar status + other info )
					, key    	=    __PARSE_URI__(    state.hash    )		// parse the hash key of the object 
					, needle 	=    $(    key    );				// in our setup, this gives us the ID that we want to scroll to

				if (    key === '#label'    ) return false;
				var scrollTop 	=    needle.offset().top - 50;				// grab it's offset and remove 50. TODO: figure out better way for 50
				// if a onBeforeAnim is passed in, call it
				if (    self.options.onBeforeAnim !== -1    ) {
					self.options.onBeforeAnim(    self.el    );
				}
				// animate to the scrollTop we calculated
				$(    'html, body'    ).animate(
					{
						scrollTop: scrollTop
					},
					function() {
						// if an onAfterAnime is passed in, call it
						if (    self.options.onAfterAnim !== -1    ) {
							self.options.onAfterAnime(    self.el    );
						}
					}
				);
			}

			// bind the self.__STATE_EVENT__ event
			History.Adapter.bind(
				window
				, self.__STATE_EVENT__ 
				, function() {    __STATE_CALLBACK__();    }
			);
		}

		, initLinkHandlers: function() {
			// METHOD: wire up all the anchors in the self.element with click handlers
			var self = this;

			// bind events that, when triggered, will trigger the self.__STATE_EVENT__ event
			self.el.on( 
				self.options.linkEvent				// the events to bind to
				, self.options.linkSelector			// the selector to look for in self.el
				, function(    event    ) {			// the function that gets fired after event is triggerred
					// grab the item stored in linkDataAttr
					// we trust that there is a DOM element 
					// with same ID somewhere in docment
					var key = $(    this    ).attr(    self.options.linkDataAttr    );
					// push this state along with the key we extracted
					History.pushState(
						{}
						, ''
						, key
					);
					// prevent default behavior
					event.preventDefault();
			});

			// TODO: figure out a better way to do this...
			// when the user scrolls, he will inevitably be going up or down
			// we should update the state to handle this case

			// create an array that holds offsets for all links that are to scroll
			var offsArray = [];
			self.el.find(    self.options.linkSelector    ).each( function(    idx, el    ) {
				el = $(	   el     );
				var attr = el.attr(    self.options.linkDataAttr    );
				var selector = '#'+attr;
				offsArray.push(
					{
						offsTop	   :     $(    selector    ).offset().top
						, label    :     attr
					}
				);
			});

			var timerInterval;
			$(    window    ).scroll( function() {
				// when scrolling ends, find item in offsArray 
				// that's closest to the document scrollTop
				clearTimeout(    timerInterval    );
				timerInterval = setTimeout( function() {

					var docTop 	= 	$(    'body'    ).scrollTop()
					    , diff 	= 	-1
					    , label	=	''
					    , iter	= 	-1;
					
					for ( var i = 0, len = offsArray.length; i < len; i++ ) {
						// TODO: add concept of tolerances to this min diff calculation
						var curr 	= 	offsArray[ i ]
						    , tmpDiff 	= 	Math.abs(    curr.offsTop - docTop    );

						if (     tmpDiff === 0    ) {
							label = curr.label;
							iter = i;
							break;
						} else if (    tmpDiff < diff    ) {
							diff = tmpDiff;
							iter = i;
						} else diff = tmpDiff;
					}
					
					if ( iter == -1 ) iter = 0;
					// if the current state of History and the closest match in array are the same
					// do nothing; else update the state
					if ( History.getState().hash === '/'+offsArray[ iter ].label ) return false;
					History.replaceState( {}, '', offsArray[ iter ].label );
				}, 500);
			});
		}

		, destroy: function() {
			// METHOD: kill this component
			$.Widget.prototype.destroy.call( this );	
		}
	}

	$.widget( 
		'tk.linkscroll'
		, __PROTOTYPE__ 
	);

})( jQuery, window, document );
