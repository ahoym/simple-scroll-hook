(function(root, scrollHook) {
  'use strict';

  /**
   * Support RequireJS and CommonJS/NodeJS module formats.
   * Attach smoothScroll to the `window` when executed as a <script>.
   */

  // RequireJS
  if (typeof define === 'function' && define.amd) {
    define(scrollHook);

  // CommonJS
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = scrollHook();

  // <script>
  } else {
    root.scrollHook = scrollHook();
  }

})(this, function () {
  'use strict';


  function ScrollHook() {
    this.events = {};
    this.positions = [];
  }


  /**
   * Register DOM element to transition to its finalState
   * @param {HTML Element} The element to act on when it is scrolled into view
   * @param {object} Information of the element's initial and final states.
   *  eg,
   *    {
   *      finalStates: 'slide-up',  // Example CSS class for slide-up animation
   *      initialStates: 'hidden',  // CSS class for hidden element
   *      position: 800             // Position to fire hooked event
   *    }
   */
  ScrollHook.prototype.register = function (element, options) {
    options = options || {};
    var position = options.position || element.offsetTop;
    var initialStates = options.initialStates || [];
    var finalStates = options.finalStates || [];

    if (typeof initialStates === 'string') {
      initialStates = [ options.initialStates ];
    }

    if (typeof finalStates === 'string') {
      finalStates = [ options.finalStates ];
    }

    this.positions.push(position);
    this.events[position] = {
      HTMLel: element,
      initialStates: initialStates,
      finalStates: finalStates
    };

    return this;
  };


  /**
   * Determine the minimum position of the hooked events are.
   * Setting this limit lets us create a conditional to only check for
   * events when the user's view is near the min.
   */
  ScrollHook.prototype.determineMin = function () {
    var positions = this.positions;

    // If there are no positions, all events have been fired.
    this.min = positions.length === 0 ? null : Math.min.apply(null, positions);

    return this;
  };


  /**
   * Remove initialStates and apply finalStates to HTML element
   * @param {object} Representation of element and its states
   */
  ScrollHook.prototype.transitionStates = function(element) {
    var elementClasses = element.HTMLel.classList;

    for (var i = 0; i < element.initialStates.length; i++) {
      elementClasses.remove(element.initialStates[i]);
    }

    for (var j = 0; j < element.finalStates.length; j++) {
      elementClasses.add(element.finalStates[j]);
    }
  };


  /**
   * Change CSS states of elements that are in or past the browser window.
   * Conditionals are put in place prior to calling this function so that
   * this won't be called on every single scroll event.
   */
  ScrollHook.prototype.transitionElements = function () {
    var viewWindowBottom = window.pageYOffset + window.innerHeight;
    var positions = this.positions.length;
    var position;
    var elementRepresentation;

    // native for loop has better performance than forEach. (jsperf)
    for (var i = 0; i < positions; i++) {
      position = this.positions[i];

      if (viewWindowBottom >= position) {
        elementRepresentation = this.events[position];

        this.transitionStates(elementRepresentation);

        // scrollUp event fired for position. It's done, so remove it.
        delete this.events[position];
        this.positions.splice(i, 1);

        // Since current position was spliced out, set i back by 1.
        i -= 1;

        // Set new min so filtering conditional can continue to work.
        this.determineMin();
      }
    }
  };


  /**
   * Add scroll listeners to window, and document load. For example if a
   * user refreshed the page (and preserved scroll position), the element
   * in view will still transition states. Listeners are automatically removed
   * after all hooked events have fired to prevent memory leaks.
   */
  ScrollHook.prototype.start = function () {
    this.determineMin();

    var _this = this;

    document.addEventListener('DOMContentLoaded', function fireHooksInView() {
      _this.transitionElements();
      /* Since this callback should be a one time call, remove event listener
       * immediately after to prevent memory leaks.
       */
      document.removeEventListener('DOMContentLoaded', fireHooksInView);
    });

    // locally scoped function so we can properly remove eventListener
    function fireHooks() {
      // Hooked events for all positions have been fired, remove handler
      if (!_this.min) {
        window.removeEventListener('DOMMouseScroll', fireHooks);
        window.removeEventListener('mousewheel', fireHooks);
        return;
      }

      // Window in view is no where near a position to listen for, skip.
      if (window.pageYOffset + window.innerHeight < _this.min) {
        return;
      }

      _this.transitionElements();
    }

    window.addEventListener('DOMMouseScroll', fireHooks); // Firefox
    window.addEventListener('mousewheel', fireHooks);     // Everything else
  };


  return new ScrollHook();
});
