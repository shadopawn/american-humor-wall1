let controller = new ScrollMagic.Controller();

let rotateTimeLine = new TimelineMax();
rotateTimeLine.to(".orbit-text", 4, {x: 0, rotationY: 0, opacity: 3});

let rotateOrbitTextScene = new ScrollMagic.Scene({
    duration: 700, // the scene should last for a scroll distance of 100px
    offset: 1200 // start this scene after scrolling for 50px
})
    .setTween(rotateTimeLine)
    .addTo(controller);


let fadeTimeLine = new TimelineMax();
fadeTimeLine.to(".orbit-text", 4, {opacity: 0});

let fadeOrbitTextScene = new ScrollMagic.Scene({
    duration: 700, // the scene should last for a scroll distance of 100px
    offset: 3500 // start this scene after scrolling for 50px
})
    .setTween(fadeTimeLine)
    .addTo(controller);