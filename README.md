Whirligig.js
============

![Woody Woodpecker, because why not](http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=26992094)

A minimal, straight-forward jQuery plugin for responsive carousels. Uses CSS transforms for the animations, for optimal performance

**Not Working Yet**: This is a work-in-progress. Don't try to use this.

###DOM Structure
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

###How to Use

Whirligig is a standard jQuery extension, bundling all its functionality in the $().whirligig function. This function takes two arguments: selectors and options.

####Selectors
Selectors lets you set jQuery selectors for the 'previous' and 'next' controls:

```
{
  previous: '.previous',
  next:     '.next'
}
```

####Options
Options is where you can specify custom behaviour for your carousel.

######breakpoints
By default, Whirligig has four breakpoints, and they look like this:

```
{
  breakpoints: [
    { width: 400,  numToShow: 1 },
    { width: 768,  numToShow: 2 },
    { width: 1024, numToShow: 3 },
    { width: '*',  numToShow: 4 }
  ]
}
```

`breakpoints` takes an array of objects, and each object should specify the *maximum* width for this breakpoint, and the number of carousel items to display at once at this breakpoint. *It is important that your array is sorted by width in ascending value*. The last breakpoint in the array will apply for all values above the largest width.


######transitionLength
Specifies the time, in milliseconds, that a transition should take. Defaults to 500.



###Example Usage
```
$('.main-carousel-wrapper').whirligig(
  {
    previous:     '.previous', next: '.next'
  }, {
    breakpoints: [
      { width: 400,  numToShow: 1 },
      { width: 1024, numToShow: 2 },
      { width: 1280, numToShow: 3 },
      { width: '*',  numToShow: 4 }
    ],
    transitionLength: 1000
  }
);
```


###External Dependencies
The only hard dependency is jQuery, which should be loaded *before* this plugin, but if you include underscore or lo-dash, resize events will be debounced.