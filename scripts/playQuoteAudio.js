let audio = new Audio();
function playPauseQuoteAudio(fileName) {
    let url = "./assets/audio/" + fileName + "?raw=true";

    if(audio.src.includes(fileName)){
        audio.paused ? audio.play() : audio.pause();
    }
    else
    {
        audio.pause();
        audio.src = url;
        audio.play();
    }   
}