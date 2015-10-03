# simple-scroll-hook
A simple, jQuery-less library for hooking HTML elements' CSS class changes to the window scroll (actually `'mousewheel'` and `'DOMMouseScroll'`, but you get the point). Multiple events can be bound to the `scrollHook` object, which creates only one scroll listener for everything hooked in. Additionally, after all its hooked events are fired, it cleans up after itself and removes its listeners to prevent memory leaks.

## What are some use cases?
As of now, `simple-scroll-hook` works ideally as the user scrolls down a site.

Example use cases include fading in/sliding up text as the user scrolls into a new section, or making elements sticky as they scroll down.

Both can be seen in the `example.html` in this repo. To view, you can simply run the following in the command line:

```
open example.html
```

## Installation
`simple-scroll-hook` can be used as:

1. A `<script>` tag, creating a `window.scrollHook` singleton object.
2. A Node.js / CommonJS module
3. An AMD module

## Usage
Say we have these CSS classes:

```CSS
.not-sticky {
  position: absolute;
  bottom: 0;
  right: 0;
}

.sticky {
  position: fixed;
  top: 0;
  right: 0;
}
```

And want to apply the `.sticky` class when the top of the viewport hits the top of `<div class='not-sticky'>`. We also want to remove `.not-sticky`.

Example as a module. `var scrollHook = require('simple-scroll-hook');` can easily be replaced with `var scrollHook = window.scrollHook;` if used as a `<script>` global.

```javascript
var scrollHook = require('simple-scroll-hook');


// Assume this exists in the DOM
var sticky = document.querySelector('.not-sticky');

// Transition states when top of viewport hits the top of this element
var transitionPos = sticky.getBoundingClientRect().top + window.innerHeight;

scrollHook.register(sticky, {
  initialStates: 'not-sticky',
  finalStates: 'sticky',
  position: transitionPos
});

// Register more transitions if desired

// This will set up the scroll listener
scrollHook.start();
```

That's it! Transitions should work as a user scrolls down, and `simple-scroll-hook` will automatically clean up after itself after all transitions are completed. This will also work if you have CSS3 animations in your classes.

## Contributing
Issues and Pull requests are always welcome. Relevant test coverage is required, please.
