"use strict";

let canvas;
let world;
let level;
let keyboard = new Keyboard();
let isMuted = false;
let fullscreen = false;
let isPausedResistent = false;
let isPaused = false;    // this
let gameStart = false;
let back = false;



function init() {
	// canvas = document.getElementById('canvas');
    // let content = document.getElementById('content');
    // content.classList.remove('content__size');
    // content.classList.add('d-none');
	// checkOrientation();

    world = null;
    gameStart = true;
    isPaused = false;

	startGame();
	showScreen('canvas');
    showButtonsIngame();



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
        element.style.borderRadius = "2rem";

        element = document.getElementById('canvas');
        element.classList.remove('fullscreen-mode');

        element = document.getElementById('main');
        element.style.width = '720px'
        element.style.height = '480px'

        element = document.getElementById('content');
        element.classList.remove('content__size');

    }

    if (!fullscreen && !gameStart) {
        let element = document.querySelectorAll('.bordRad');
        element.forEach((ele) => {
            ele.style.borderRadius = '';
        })
    }

}




async function startGame() {
    await newGame();
}


async function newGame() {
    initLevel();
    canvas = document.getElementById('canvas');
    canvas.value = '';
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
        // stopAllSounds();
    }

    if (event.key === 'P' || event.key === 'p') {
        isPaused = !isPaused;
        isPausedResistent = isPaused;
        toggleMute();
    }

    if (event.key === 'V' || event.key === 'v') {
        toggleFullscreen();

    }

});



function showScreen(screenId) {
 
    const screens = ['game', 'controls', 'about', 'story', 'canvas', 'section__controls', 'game__lost', 'game__won', 'ingame__button__container'];
    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) {
            element.classList.add('d-none');
        }
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('d-none');
    };
}




function toggleFullscreen() {
    fullscreen = !fullscreen;
    let content = document.getElementById('content');
    let fullscreenIcon = document.getElementById('fullscreen');
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

        fullscreenIcon.src = "./assets/icons/normalscreen.png"

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

        fullscreenIcon.src = "./assets/icons/fullscreen.png"
    }

}



// Event-Listener hinzufügen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari und Opera
document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
document.addEventListener('MSFullscreenChange', handleFullscreenChange); // IE/Edge



function handleFullscreenChange() {
    if (document.fullscreenElement) {
        fullscreen = true;
        styleChangeForFullScreen();
    } else {
        fullscreen = false;
        styleChangeForNormalScreen();
    }

    if (isPausedResistent) {
        isPaused = true;
        if (!isMuted) {
            toggleMute();
        }
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
    sound.currentTime = 0;
    activeSounds = activeSounds.filter(s => s !== sound);
}

function stopAllSounds() {
    activeSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    activeSounds = [];
}


function showButtonsIngame() {
    const container = document.getElementById('ingame__button__container');
    container.classList.remove('d-none');

}


function showControlsIngame() {
    const container = document.getElementById('controls');
    container.classList.toggle('d-none');
    container.style.position = 'absolute';
    container.style.inset = '0';
    isPaused = !isPaused;

    if (!back) {
        const containerButton = document.getElementById('controls__back-btn');
        containerButton.onclick = null;
        containerButton.removeAttribute('onclick');
        containerButton.onclick = () => showControlsIngameBackButton(containerButton);
    }

    back = !back;
}


function showControlsIngameBackButton(containerButton) {
    containerButton.onclick = null;
    containerButton.removeAttribute('onclick');
    containerButton.onclick = () => showScreen('game');
    // back = true;
    showControlsIngame();
}


/* -- Landscape - check  -------------------- */


window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

function checkOrientation() {
    const container = document.getElementById('landscapeWarning');

    if (window.innerHeight < 933) {
        // Bedingung für Mobiltelefone und Tablets (Höhe < 933px)
        if (window.innerWidth < window.innerHeight) {
            // Wenn das Gerät im Hochformat ist (Breite < Höhe)
            container.classList.remove('d-none');
            isPaused = true;
        } else {
            // Wenn das Gerät im Querformat ist (Breite > Höhe)
            container.classList.add('d-none');
            if (!isPausedResistent) {
                isPaused = false;
            }
        }
    } else {
        // Wenn das Gerät eine Höhe >= 933px hat (z.B. Desktop), wird die Warnung ausgeblendet
        container.classList.add('d-none');
        if (!isPausedResistent) {
            isPaused = false;
        }
    }
}



function gameWon() {
    document.getElementById('game__won').classList.remove("d-none");
    toggleFullscreen();
}



function gameLost() {
    document.getElementById('game__lost').classList.remove("d-none");
    toggleFullscreen();
}



function backToStartScreen() {
    gameStart = false;
    showScreen('game');
    document.getElementById('content').classList.add('content__size');
    // document.getElementById('game__lost').classList.add('d-none');
}


function restartGame() {

    document.getElementById("game__won").classList.add("d-none");
    document.getElementById("game__lost").classList.add("d-none");


    init();

    // showScreen('canvas');
    // showButtonsIngame();

}