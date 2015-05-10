/**
 * Whirligig.js - A responsive carousel jQuery plugin.
 * @author Joshua Comeau
 * (Conceptualized with Alessia Bellisario. Inspiration taken from a similar plugin by Stéphane Roucheray)
 * @extends jquery
 */

jQuery.fn.whirligig = function(selectors, opts) {
  // Define all used variables up here
  var $carousel, $carouselGroup, $carouselItems,
      carouselWidth, carouselItemWidth, carouselGroupWidth,
      numOfCarouselItems, numToShow, isAnimating,
      cssCarouselTranslatedState, cssCarouselBaseState,
      logging;

  // Development logging. Set to 'true' for lots of verbose output in the console.
  logging = false;

  // If no opts argument is provided, use an empty object
  opts = opts || {};

  // Extend our default opts with any provided opts
  var defaultopts = {
    breakpoints: [
      { width: 400,  numToShow: 1 },
      { width: 768,  numToShow: 2 },
      { width: 1024, numToShow: 3 },
      { width: '*',  numToShow: 4 }
    ],
    transitionLength:  0.5
  };
  opts = $.extend({}, defaultopts, opts);


  var setCarouselVariables = function() {
    $carousel      = $(this);
    $carouselGroup = $($carousel.children()[0]);
    $carouselItems = $($carouselGroup.children());

    if (logging) {
      console.log("Carousel:",       $carousel);
      console.log("Carousel Group:", $carouselGroup);
      console.log("Carousel Items:", $carouselItems.length);
    }
  }.bind(this);

  function calculateNumToShow(breakpoints) {
    var windowWidth = $(window).width();
    var numToShow, i;

    // iterate through all but the largest breakpoint, looking for the
    // biggest breakpoint under the window width.
    for ( i=0; i<breakpoints.length-1; i++ ) {
      if ( windowWidth <= breakpoints[i].width ) {
        // We've found the first breakpoint that meets or exceeds our width.
        // We're using it!
        numToShow = breakpoints[i].numToShow;
        break;
      }

      // In the case that our window width exceeds our largest breakpoint,
      // set it automatically to the largest breakpoint.
      if ( !numToShow ) {
        numToShow = breakpoints[breakpoints.length-1].numToShow;
      }
    }

    return numToShow;
  }


  function init() {
    ////// 1. Do our initial bindings and variable-setting
    setCarouselVariables();

    ////// 2. Figure out how many carousel items to display at once
    // This number changes depending on the window size.
    numToShow = calculateNumToShow(opts.breakpoints);
    if (logging) console.log("Number to show:", numToShow);


    ////// 3. Calculate and set carousel width and carouselItem width.
    numOfCarouselItems  = $carouselItems.length;
    carouselWidth       = $carousel.outerWidth();
    carouselItemWidth   = carouselWidth / numToShow;
    carouselGroupWidth  = carouselItemWidth*numOfCarouselItems + 1000;
    //                                                             ^
    //           this 1000px buffer is to avoid tiles stacking during resize events.

    $carouselItems.width(carouselItemWidth);
    $carouselGroup.width(carouselGroupWidth);

    if (logging) {
      console.log("calculated carousel item width:", carouselItemWidth);
      console.log("calculated group width:", carouselGroupWidth);
    }


    ////// 4. Create our CSS 'classes' with these new values, and apply them as needed.
    cssCarouselTransition   = { transition: opts.transitionLength+"s" };
    cssCarouselNoTransition = { transition: "0s" };
    cssCarouselTranslate    = { transform:  "translate(-" + carouselItemWidth + "px)", };
    cssCarouselNoTranslate  = { transform:  "translate(0)", };

    // Initialize the carouselGroup to our base state
    $carouselGroup.css( $.extend({}, cssCarouselNoTranslate, cssCarouselTransition) );

    // Ensure our carousel hides items outside the viewport
    $carousel.css( {overflow: "hidden"});


    ////// 5. Fill our carousel group to contain at least numToShow+1
    if ( numOfCarouselItems < numToShow+1 ) {
      $carouselItems.each(function() {
        $(this).clone().appendTo($carouselGroup);
      });

      // Recursively call our init function. This ensures this process runs
      // until we have a sufficient number of slides in our carousel.
      init();
    }
  }

  function bindEventHandlers() {
    $(selectors.next).on("click", function() { clickHandler('next') });
    $(selectors.previous).on("click", function() { clickHandler('previous') });

    // If underscore/lodash is available, debounce the init function. Otherwise,
    // just bind it to window resize normally.
    $(window).on("resize", window._ && window._.debounce ? _.debounce(init, 100) : init);
  }

  function clickHandler(direction) {
    // We only listen to clicks while the animation is not running.
    if ( isAnimating ) return false;

    // We need to reset our $carouselGroup variable, to make it match the DOM.
    setCarouselVariables();

    // We also need to kick off the start of this animation.
    isAnimating = true;

    direction === 'previous' ? clickPrevious() : clickNext();
  }

  function clickNext() {
    if (logging) console.log("Clicked 'next'!");

    // The strategy: On click, add transition and translate.
    // After the animation has finished, remove both of them, and move the first
    // carouselItem to the back of the pile.

    $carouselGroup.css( $.extend({}, cssCarouselTranslate, cssCarouselTransition) );

    window.setTimeout(function() {
      $carouselGroup
        .css( $.extend({}, cssCarouselNoTranslate, cssCarouselNoTransition) )
        .append( $carouselItems.first().detach() );

      // Our animation is done. Denote it as such!
      isAnimating = false;
    }, opts.transitionLength*1000);
  }


  function clickPrevious() {
    if (logging) console.log("Clicked 'previous'!");

    // The strategy: on click, immediately prepend the last item on the front of
    // the list, and translate it without transition.
    // Then, animate the transition back to 0px translate.
    $carouselGroup
      .prepend( $carouselItems.last().detach() )
      .css( $.extend({}, cssCarouselTranslate, cssCarouselNoTransition) );

    // We need a very slight delay so that we can update the DOM with the new position,
    // and then almost immediately we need to update it to add the animated translate.
    window.setTimeout(function() {
      $carouselGroup.css( $.extend({}, cssCarouselNoTranslate, cssCarouselTransition) );

      // After our transition length, we need to update the animation status to false
      window.setTimeout(function() {
        isAnimating = false;
      }, opts.transitionLength*1000);
    }, 75);
  }
  // Bind our previous/next button click handlers and media query event handlers.
  // Doing this outside of init(), because init() may be called several times on window resize.
  bindEventHandlers();

  // And we're off!
  init();

}