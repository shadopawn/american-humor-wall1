let audio = new Audio();
function playQuoteAudio(fileName) {
    let url = "https://github.com/shadopawn/3d-web-prototype/blob/master/assets/audio/" + fileName + "?raw=true"
    audio.pause();
    audio.src = url;
    audio.play();
}