# 0.2.0
+ Add `scroll` listener only now, not `mousewheel` or `DOMMouseScroll`. The latter two did not capture events from pressing the down arrow on the keyboard or when scroll was not triggered by the mouse.

# 0.1.2
+ Syntax changes for internal variables not meant to be used publicly.
  + `ScrollHook.positions` --> `ScrollHook._positions`
  + `ScrollHook.events` --> `ScrollHook._events`
+ Update docstrings of some functions.

# 0.1.1
+ Add throttling functionality for performance.
  + **scrollHook.setThrottleTime(ms)**: Set the interval between firing wheel event callbacks.


# 0.1.0
+ Initial implementation.
  + **scrollHook.start()**: Add the wheel event listener, and fire registered events.
  + **scrollHook.register(element, config)**: Register an element, and its configuration.
```
// Example configuration:
{
  initialStates: {string | array},  CSS class(es) of the element when out of view.
  finalStates: {string | array},    CSS class(es) of the element when scrolled into view.
  position: {int}                   (optional) Where to transition classes.
}
```
Note,
`simple-scroll-hook` can act to just remove `initialStates`, making `finalStates` optional.
It can also be done vice-versa.

`position`, if not specified, will default to the `element.offsetTop`.
