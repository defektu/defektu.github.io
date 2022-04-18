console.log(`%c

made by @defektu 2022

██████  ███████ ███████ ███████ ██   ██ ████████ ██    ██ 
██   ██ ██      ██      ██      ██  ██     ██    ██    ██ 
██   ██ █████   █████   █████   █████      ██    ██    ██ 
██   ██ ██      ██      ██      ██  ██     ██    ██    ██ 
██████  ███████ ██      ███████ ██   ██    ██     ██████  
                                                          
defektu.com

`, `font-family: monospace`);


import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

// audio source
const audioEl = document.getElementById('audio');
// instantiate analyzer
const audioMotion = new AudioMotionAnalyzer(
    document.getElementById('container'), {
        source: audioEl,
        smoothing: 0.9,
        useCanvas: false
    }
);

// play stream
document.getElementById('live').addEventListener('click', () => {
    audioEl.src = 'http://wwfm.streamguys1.com/live';
    audioEl.play();
});

// file upload
document.getElementById('upload').addEventListener('change', e => {
    const fileBlob = e.target.files[0];
    if (fileBlob) {
        audioEl.src = URL.createObjectURL(fileBlob);
        audioEl.play();
    }
});


const micButton = document.getElementById('mic');
micButton.addEventListener('change', () => {
    const audioEl = document.getElementById('audio');

    if (micButton.checked) {
        audioEl.pause();
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(stream => {
                    // create stream using audioMotion audio context
                    const micStream = audioMotion.audioCtx.createMediaStreamSource(stream);
                    audioMotion.volume = 0;
                    audioMotion.connectInput(micStream);
                })
                .catch(err => {
                    alert('Microphone access denied by user');
                });
        } else {
            alert('User mediaDevices not available');
        }
    } else {
        audioMotion.disconnectInput(audioMotion.connectedSources[1]);
        audioMotion.volume = 1;
    }

});


let initX = 0;

let speed = 0.05;
let dataX = 0;

function smooth() {

    let distX = dataX - initX;
    initX = initX + (distX * speed);
    requestAnimationFrame(smooth);
}
smooth();

var elem = document.getElementById("bodymovin");
var anim, animationAPI;

function init() {
    let loaderWrapper = document.querySelector('.loading');
    loaderWrapper.className = "loading hidden";

    animationAPI = lottie_api.createAnimationApi(anim);

    var trebleCont = animationAPI.getKeyPath("C | Treble_Hand 2,Transform,Position");
    var trebleBackHandCont = animationAPI.getKeyPath("C | Treble_BackHand,Transform,Position");
    var highmidCont = animationAPI.getKeyPath("C | Mid_R_Hand 2,Transform,Position");

    var midCont = animationAPI.getKeyPath("BoneControl,Transform,Position");
    //var midCont = animationAPI.getKeyPath("C | Mid_Bone 2,Transform,Position");
    var lowMidCont = animationAPI.getKeyPath("C | Mid_Head,Transform,Position");
    var bassCont = animationAPI.getKeyPath("C | Bass_L_Hand_Wrist,Transform,Position");
    var headCont = animationAPI.getKeyPath("C | BassHead,Transform,Position");
    var peakCont = animationAPI.getKeyPath("C | Woman_Hand,Transform,Position");


    // If called with no parameters, it returns the overall spectrum energy obtained by the average of amplitudes of the currently displayed frequency bands.
    // ‘peak’	peak overall energy value of the last 30 frames (approximately 0.5s)
    // ‘bass’	average energy between 20 and 250 Hz
    // ‘lowMid’	average energy between 250 and 500 Hz
    // ‘mid’	average energy between 500 and 2000 Hz
    // ‘highMid’	average energy between 2000 and 4000 Hz
    // ‘treble’	average energy between 4000 and 16000 Hz

    animationAPI.addValueCallback(trebleCont, function(currentValue) {

        trebleCont[0] = audioMotion.getEnergy(700, 1000) * 1200 - 200
        return trebleCont;
    });
    animationAPI.addValueCallback(trebleBackHandCont, function(currentValue) {
        //range -200,200
        trebleBackHandCont[0] = audioMotion.getEnergy(50, 3000) * 1600 - 200
        return trebleBackHandCont;
    });


    animationAPI.addValueCallback(highmidCont, function(currentValue) {
        //range -200,200
        highmidCont[0] = audioMotion.getEnergy(150, 600) * 800 - 200
        return highmidCont;
    });
    animationAPI.addValueCallback(midCont, function(currentValue) {
        //range -200,200
        var energy = audioMotion.getEnergy(200, 700) * 1200;
        energy = Math.min(Math.max(energy, 0), 170);
        midCont[0] = energy + audioMotion.getEnergy(200, 3000) * 200 - 50;
        return midCont;
    });
    animationAPI.addValueCallback(lowMidCont, function(currentValue) {
        //range -200,200
        lowMidCont[0] = audioMotion.getEnergy(50, 400) * 800 - 200
        return lowMidCont;
    });


    animationAPI.addValueCallback(bassCont, function(currentValue) {
        //range -200,200
        bassCont[0] = audioMotion.getEnergy(50, 300) * -400 + 200
        return bassCont;
    });
    animationAPI.addValueCallback(headCont, function(currentValue) {
        //range -200,200
        headCont[0] = audioMotion.getEnergy(50, 1000) * 800 - 200
        return headCont;
    });


    animationAPI.addValueCallback(peakCont, function(currentValue) {
        //range -200,200
        peakCont[0] = audioMotion.getEnergy(50, 8000) * 1600 - 200
        return peakCont;
    });

}

var animData = {
    container: elem,
    renderer: "svg",
    loop: true,
    autoplay: true,
    rendererSettings: {
        progressiveLoad: true,
        preserveAspectRatio: "xMidYMid meet",
        imagePreserveAspectRatio: "xMidYMid meet"
    },
    path: "data.json"
};
anim = lottie.loadAnimation(animData);
anim.addEventListener("DOMLoaded", init);