let controller = new ScrollMagic.Controller();

let timeLine = new TimelineMax();
timeLine.to(".orbit-text", 4, {x: 0, rotationY: 0, opacity: 3});

let scrollMagicScene = new ScrollMagic.Scene({
    duration: 700, // the scene should last for a scroll distance of 100px
    offset: 1200 // start this scene after scrolling for 50px
})
    .setTween(timeLine)
    .addTo(controller);


let timeLine2 = new TimelineMax();
timeLine2.to(".orbit-text", 4, {opacity: 0});

let scrollMagicScene2 = new ScrollMagic.Scene({
    duration: 700, // the scene should last for a scroll distance of 100px
    offset: 3500 // start this scene after scrolling for 50px
})
    .setTween(timeLine2)
    .addTo(controller);