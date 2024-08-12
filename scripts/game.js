"use strict";

let canvas;
let world;
let level;
let keyboard = new Keyboard();
let isLoading = false;
let isMuted = false;
let fullscreen = false;
let isPaused = false;    // this
let gameStart = false;



function init() {
	canvas = document.getElementById('canvas');
	checkOrientation();
	startGame();
	showScreen('canvas');
    gameStart = true;

    if (fullscreen) {
        styleChangeForFullScreen();
    } else {
        styleChangeForNormalScreen();
    }

}




function styleChangeForFullScreen() {
    if (fullscreen && gameStart) {
        let element = document.getElementById('content');
        element.classList.add('d-none');
        
        element = document.getElementById('header');
        element.classList.add('d-none');
        
        element = document.getElementById('canvas');
        element.style.borderRadius = "0px";

        element = document.getElementById('canvas');
        element.classList.add('fullscreen-mode');

        element = document.getElementById('main');
        element.style.width = '100%'
        element.style.height = '100%'
    }


    // Test
    if (fullscreen && !gameStart) {
        let element = document.querySelectorAll('.bordRad');
        element.forEach((ele) => {
            ele.style.borderRadius = '0px';
        })
       

    }
}



function styleChangeForNormalScreen() {
    if (!fullscreen && gameStart) {
        let element = document.getElementById('content');
        element.classList.remove('d-none');

        element = document.getElementById('header');
        element.classList.remove('d-none');
        
        element = document.getElementById('canvas');
        element.style.borderRadius = "10px";

        element = document.getElementById('canvas');
        element.classList.remove('fullscreen-mode');

        element = document.getElementById('main');
        element.style.width = '720px'
        element.style.height = '480px'

        element = document.getElementById('content');
        element.classList.toggle('content__size');
    }

    // Test
    if (!fullscreen && !gameStart) {
        let element = document.querySelectorAll('.bordRad');
        element.forEach((ele) => {
            ele.style.borderRadius = '2rem';
        })
        
        

    }

}




async function startGame() {
    if (!isLoading) {
        await newGame();
        setTimeout(() => {
            isLoading = true;
        }, 2000);
    }
}


async function newGame() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
}


window.addEventListener('keydown', (event) => {
    if (!isPaused) {
        if (event.key =='ArrowUp') {
            keyboard.UP = true;
        };
        if (event.key =='ArrowDown') {
            keyboard.DOWN = true;
        };
        if (event.key =='ArrowLeft') {
            keyboard.LEFT = true;
        };
        if (event.key =='ArrowRight') {
            keyboard.RIGHT = true;
        };
        if (event.key ==' ') {
            keyboard.SPACE = true;
        };
        if (event.key =='D' || event.key =='d') {
            keyboard.D = true;
        };
    }
   
})


window.addEventListener('keyup', (event) => {
	if (event.key =='ArrowUp') {
		keyboard.UP = false;
	};
	if (event.key =='ArrowDown') {
		keyboard.DOWN = false;
	};
	if (event.key =='ArrowLeft') {
		keyboard.LEFT = false;
	};
	if (event.key =='ArrowRight') {
		keyboard.RIGHT = false;
	};
	if (event.key ==' ') {
		keyboard.SPACE = false;
	};
	if (event.key =='D' || event.key =='d') {
		keyboard.D = false;
	};
})


document.addEventListener('keydown', function(event) {
    if (event.key === 'M' || event.key === 'm') {
        toggleMute();
        stopAllSounds();
    }

    if (event.key === 'P' || event.key === 'p') {
        isPaused = !isPaused;
        toggleMute();
        stopAllSounds();
    }

    if (event.key === 'V' || event.key === 'v') {
        toggleFullscreen();
    }

});


function checkOrientation() {
    if (window.matchMedia("(orientation: landscape)").matches) {
        if (window.innerHeight < 480) {
            newHeight = window.innerHeight;
            document.getElementById('canvas').style.height = `${newHeight}px`;
        }
    }
    else {
        document.getElementById('canvas').style.height = `100%`;
    }
}





function showScreen(screenId) {
    const screens = ['game', 'controls', 'about', 'canvas', 'section__controls'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.classList.add('d-none');
        }
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('d-none');
    }
}




function toggleFullscreen() {
    fullscreen = !fullscreen;
    let content = document.getElementById('content');
    if (!document.fullscreenElement) {
        if (content.requestFullscreen) {
            content.requestFullscreen();
        } else if (content.mozRequestFullScreen) { // Firefox
            content.mozRequestFullScreen();
        } else if (content.webkitRequestFullscreen) { // Chrome, Safari and Opera
            content.webkitRequestFullscreen();
        } else if (content.msRequestFullscreen) { // IE/Edge
            content.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

}



// Event-Listener hinzufügen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari und Opera
document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge

// Funktion zum Verarbeiten von Änderungen des Vollbildmodus
function handleFullscreenChange() {
    if (document.fullscreenElement) {
        fullscreen = true;
        styleChangeForFullScreen();
    } else {
        fullscreen = false;
        styleChangeForNormalScreen();
    }

}





function toggleMute() {
    const muteButton = document.getElementById('game__mute-btn');
    const unmuteButton = document.getElementById('game__unmute-btn');
    isMuted = !isMuted;
	if (isMuted) {
        stopAllSounds();
    };
    muteButton.classList.toggle('d-none', isMuted);
    unmuteButton.classList.toggle('d-none', !isMuted);
}



/* -------------------------------- */


let activeSounds = [];

function playSound(sound) {
    if (!isMuted & !isPaused) {
        sound.play();
        activeSounds.push(sound);
    }
}

function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0; // Setzt den Sound auf den Anfang zurück
    activeSounds = activeSounds.filter(s => s !== sound); // Entfernt den Sound aus der aktiven Liste
}

function stopAllSounds() {
    activeSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    activeSounds = []; // Leert die Liste der aktiven Sounds
}
