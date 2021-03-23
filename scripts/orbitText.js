const firstOrbitTextOffset = 800;
const spaceBetweenOrbitTexts = 1500;
const staticDistance = 0;
const rotateInOutDuration = 700;

function addAllOrbitAnimations(){
    const orbitTexts = document.querySelectorAll(".orbit-text");

    let currentPosition = firstOrbitTextOffset;
    orbitTexts.forEach(orbitText => {
        addOrbitAnimations(orbitText, currentPosition);
        currentPosition += (staticDistance + 2*rotateInOutDuration + spaceBetweenOrbitTexts);
    });
    
    const totalOrbitTextDistance = currentPosition;
    document.getElementById("right-side").style.marginTop = totalOrbitTextDistance + "px";
}

const orbitTextController = new ScrollMagic.Controller();

function addOrbitAnimations(element, start){
    //Add animation to rotate in
    let rotateTimeLine = new TimelineMax();
    rotateTimeLine.to(element, 4, {x: 0, rotationY: 0, opacity: 3});

    new ScrollMagic.Scene({
        duration: rotateInOutDuration, 
        offset: start
    })
        .setTween(rotateTimeLine)
        .addTo(orbitTextController);


    //Add animation to rotate out
    let fadeTimeLine = new TimelineMax();
    fadeTimeLine.to(element, 4, {x: 400, rotationY: 70, opacity: 0});

    const rotateOut = start + staticDistance + rotateInOutDuration;

    new ScrollMagic.Scene({
        duration: rotateInOutDuration,
        offset: rotateOut
    })
        .setTween(fadeTimeLine)
        .addTo(orbitTextController);
}