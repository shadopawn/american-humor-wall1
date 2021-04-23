const firstOrbitTextOffset = 800;
const spaceBetweenOrbitTexts = 1500;
const staticDistance = 1200;
const rotateInOutDuration = 700;

function addAllOrbitAnimations(){
    const orbitTexts = document.querySelectorAll(".orbit-text");

    let currentPosition = firstOrbitTextOffset;
    orbitTexts.forEach(orbitText => {
        addOrbitAnimations(orbitText, currentPosition);
        let distanceToNextStart = staticDistance + 2*rotateInOutDuration + spaceBetweenOrbitTexts;
        currentPosition += distanceToNextStart;
    });
    
    const totalOrbitTextDistance = currentPosition;
    document.getElementById("right-side").style.marginTop = totalOrbitTextDistance + "px";
}

const orbitTextController = new ScrollMagic.Controller();

function addOrbitAnimations(element, start){
    addRotateInAnimation(element, start);

    const distanceToNextAnimation = staticDistance + rotateInOutDuration;
    const rotateOutStart = start + distanceToNextAnimation;
    addRotateOutAnimation(element, rotateOutStart);
}

function addRotateInAnimation(element, start) {
    let rotateInTimeLine = new TimelineMax();
    rotateInTimeLine.to(element, 4, {x: 0, rotationY: 0, opacity: 3});

    new ScrollMagic.Scene({
        duration: rotateInOutDuration,
        offset: start
    })
        .setTween(rotateInTimeLine)
        .addTo(orbitTextController);
}

function addRotateOutAnimation(element, start) {
    let rotateOutTimeLine = new TimelineMax();
    rotateOutTimeLine.to(element, 4, {x: 400, rotationY: 70, opacity: 0});

    new ScrollMagic.Scene({
        duration: rotateInOutDuration,
        offset: start
    })
        .setTween(rotateOutTimeLine)
        .addTo(orbitTextController);
}