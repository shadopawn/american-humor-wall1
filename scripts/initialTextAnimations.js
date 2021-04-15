const initialTextSelector = ".initial-text"

function fadeOutStartingText(){
    TweenMax.to(initialTextSelector, 3, {opacity: 0});
}

let fadeInStartingTextController;

function fadeInStartingTextOnScroll(){

    if (fadeInStartingTextController)
        fadeInStartingTextController.destroy();

    fadeInStartingTextController = new ScrollMagic.Controller();

    let scrollDuration = 1.5*window.innerHeight;

    new ScrollMagic.Scene({
        triggerElement: "#bottom-spacer",
        duration: scrollDuration,
        triggerHook: 0
    })
        .setTween(initialTextSelector, 1, {opacity: 1})
        .addTo(fadeInStartingTextController);
}