/**
 * Create a buffer between the top of the window and elements to be tested
 */
function createBuffer() {
  'use strict';

  var placeholder = document.createElement('section');
  placeholder.style.height = '1000px';

  return placeholder;
}


/**
 * Simulate scroll so that the viewport bottom is at @position
 * @param {int} window position to simulate scroll to.
 */
function scrollViewBottomTo(position) {
  'use strict';

  var viewBottomPosition = position - window.innerHeight;
  var event = new CustomEvent('optimizedScroll');

  // WheelEvent only fires the event, but doesn't change the window at all.
  window.scrollTo(0, viewBottomPosition);

  window.dispatchEvent(event);
}
