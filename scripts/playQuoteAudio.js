let audio = new Audio();
function playQuoteAudio(fileName) {
    let url = "./assets/audio/" + fileName + "?raw=true";
    audio.pause();
    audio.src = url;
    audio.play();
}