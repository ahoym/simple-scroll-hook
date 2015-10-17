/**
 * Scroll to position with window, but no custom event. As strange as it looks,
 * both window.pageYOffset and window.scrollTo() need to be done to work for
 * tests locally and in travis-CI.
 * @param {integer} position to scroll to
 */
function scrollToPosition(yPosition) {
  // This works locally
  window.pageYOffset = yPosition;

  // This works in travis-CI
  // window.scrollTo(0, yPosition);
}

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

  // CustomEvent only fires the event, but doesn't change the window at all.
  scrollToPosition(viewBottomPosition);

  window.dispatchEvent(event);
}
