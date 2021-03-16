let audio = new Audio();
function playPauseQuoteAudio(fileName) {
    let url = "./assets/audio/" + fileName + "?raw=true";

    if(audio.src.includes(fileName)){
        if(audio.paused){
            audio.play();
        }
        else
        {
            audio.pause();
        }
    }
    else
    {
        audio.pause();
        audio.src = url;
        audio.play();
    }   
}