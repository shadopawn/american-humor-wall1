const orbitTextSpacing = 1500;
const staticDistance = 2000;

function addAllOrbitAnimations(){
    const orbitTexts = document.querySelectorAll(".orbit-text");

    let currentPosition = orbitTextSpacing;
    orbitTexts.forEach(orbitText => {
        addOrbitAnimations(orbitText, currentPosition);
        currentPosition += (orbitTextSpacing + staticDistance);
    });

    document.getElementById("right-side").style.marginTop = currentPosition + "px";
}

const orbitTextController = new ScrollMagic.Controller();

function addOrbitAnimations(element, start){
    let rotateTimeLine = new TimelineMax();
    rotateTimeLine.to(element, 4, {x: 0, rotationY: 0, opacity: 3});

    let rotateOrbitTextScene = new ScrollMagic.Scene({
        duration: 700, 
        offset: start
    })
        .setTween(rotateTimeLine)
        .addTo(orbitTextController);


    let fadeTimeLine = new TimelineMax();
    fadeTimeLine.to(element, 4, {x: 400, rotationY: 70, opacity: 0});

    const fadeOut = start + staticDistance;

    let fadeOrbitTextScene = new ScrollMagic.Scene({
        duration: 700, 
        offset: fadeOut
    })
        .setTween(fadeTimeLine)
        .addTo(orbitTextController);
}