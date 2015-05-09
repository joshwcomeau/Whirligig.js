Whirligig.js
============

A minimal, straight-forward jQuery plugin for responsive carousels.

####How to Use
This plugin expects the following structure:

```
<div class="main-carousel-wrapper">
  <ul>
    <li class="carousel-item"></li>
    <li class="carousel-item"></li>
  </ul>
</div>

<div class="previous">Previous</div>
<div class="next">Next</div>
```

The elements can be whatever you like (as long as they're display: block), but the convention is to use ul/li. What's important is you have an outer container that will effectively become the viewport, a collection-holder that holds all of the carousel items, and then the carousel items themselves. We also have our controls for navigating forwards/backwards.

######Enable the carousel

```
$('.main-carousel-wrapper').whirligig(
  { previous:     '.previous', next: '.next' },
  { startingSize: 'medium' }
);
```


###External Dependencies
The only hard dependency is jQuery, which should be loaded *before* this plugin, but if you include underscore or lo-dash, resize events will be debounced.