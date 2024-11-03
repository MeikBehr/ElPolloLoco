"use strict";

let canvas;
let world;
let level;
let keyboard = new Keyboard();
let activeSounds = [];
let isMuted = false;
let fullscreen = false;
let isPausedResistent = false;
let isPaused = false;
let gameStart = false;
let back = false;



/**
 * Initializes the game settings, sets up the initial state, 
 * and configures the display mode.
 * 
 * - Resets the game world and sets `gameStart` to true.
 * - Unpauses the game by setting `isPaused` to false.
 * - Starts the game, displays the game canvas, and adds touch event listeners.
 * - Adjusts the screen style for fullscreen or normal mode based on settings.
 */
function init() {
    world = null;
    gameStart = true;
    isPaused = false;
    startGame();
    showScreen('canvas');
    touchScreenTouchStartEvent();
    touchScreenTouchEndEvent();
    
    if (fullscreen) {
        styleChangeForFullScreen();
    } else {
        styleChangeForNormalScreen();
    }
}




function showElements() {
    document.getElementById('content').classList.remove('d-none');
    document.getElementById('header').classList.remove('d-none');
}

function styleCanvasBorderRadius() {
    const canvas = document.getElementById('canvas');
    canvas.style.borderRadius = "2rem";
    canvas.classList.remove('fullscreen-mode');
    document.getElementById('content__canvas').classList.remove('fullscreen-mode');
}

function resetBorderRadiusForElements() {
    document.querySelectorAll('.bordRad').forEach(ele => ele.style.borderRadius = '');
}

function styleChangeForNormalScreen() {
    if (!fullscreen && gameStart) {
        showElements();
        styleCanvasBorderRadius();
    }
    
    if (!fullscreen && !gameStart) {
        resetBorderRadiusForElements();
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





const keyMap = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    ' ': 'SPACE',
    'D': 'D',
    'd': 'D'
};

function handleKey(event, isPressed) {
    if (!isPaused || !isPressed) {
        const keyAction = keyMap[event.key];
        if (keyAction) keyboard[keyAction] = isPressed;
    }
}

window.addEventListener('keydown', (event) => handleKey(event, true));
window.addEventListener('keyup', (event) => handleKey(event, false));
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);


const actionMap = {
    'M': toggleMute,
    'm': toggleMute,
    'P': () => {
        isPaused = !isPaused;
        isPausedResistent = isPaused;
    },
    'p': () => {
        isPaused = !isPaused;
        isPausedResistent = isPaused;
    },
    'V': toggleFullscreen,
    'v': toggleFullscreen
};

document.addEventListener('keydown', (event) => {
    const action = actionMap[event.key];
    if (action) action();
});

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => document.addEventListener(event, handleFullscreenChange));



function showScreen(screenId) {
    const screens = ['game', 'controls', 'about', 'story', 'canvas', 'section__controls', 'game__lost', 'game__won'];

    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) element.classList.add('d-none');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.remove('d-none');
}


function handleFullscreenChange() {
    fullscreen = Boolean(document.fullscreenElement);
    fullscreen ? styleChangeForFullScreen() : styleChangeForNormalScreen();
}




function requestFullscreen(element) {
    const requestFullscreenMethod = element.requestFullscreen || element.mozRequestFullScreen || 
        element.webkitRequestFullscreen || element.msRequestFullscreen;
    if (requestFullscreenMethod) requestFullscreenMethod.call(element);
}

function exitFullscreen() {
    const exitFullscreenMethod = document.exitFullscreen || document.mozCancelFullScreen || 
        document.webkitExitFullscreen || document.msExitFullscreen;
    if (exitFullscreenMethod) exitFullscreenMethod.call(document);
}

function toggleFullscreen() {
    fullscreen = !fullscreen;
    const content = document.getElementById('content');
    const fullscreenIcon = document.getElementById('fullscreen');

    if (!document.fullscreenElement) {
        requestFullscreen(content);
        fullscreenIcon.src = "./assets/icons/normalscreen.png";
    } else {
        exitFullscreen();
        fullscreenIcon.src = "./assets/icons/fullscreen.png";
    }
}


function setFullscreenStyles() {
    ['header'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('d-none');
    });
    ['content__canvas', 'canvas'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.borderRadius = "0px";
            element.classList.add('fullscreen-mode');
        }
    });
    const content = document.getElementById('content');
    if (content) {
        content.style.width = '100%';
        content.style.height = '100%';
    }
}

function resetBorderRadiusForElements() {
    document.querySelectorAll('.bordRad').forEach(ele => {
        ele.style.borderRadius = '0px';
    });
}

function styleChangeForFullScreen() {
    if (fullscreen) {
        gameStart ? setFullscreenStyles() : resetBorderRadiusForElements();
    }
}



function updateAudioIcons() {
    const audioSrc = isMuted ? './assets/icons/mute.png' : './assets/icons/audio.png';
    document.getElementById('audio-btn').src = audioSrc;
    document.getElementById('audio-btn-mobile').src = audioSrc;
}

function toggleMuteButtons() {
    const muteButton = document.getElementById('game__mute-btn');
    const unmuteButton = document.getElementById('game__unmute-btn');
    muteButton.classList.toggle('d-none', isMuted);
    unmuteButton.classList.toggle('d-none', !isMuted);
}

function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) stopAllSounds();
    updateAudioIcons();
    toggleMuteButtons();
}

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


function showControlsIngameBackButton(containerButton) {
    containerButton.onclick = null;
    containerButton.removeAttribute('onclick');
    containerButton.onclick = () => showScreen('game');
    showControlsIngame();
}


function gameWon() {
    showScreen('game__won');
}



function gameLost() {
    document.getElementById('game__lost').classList.remove("d-none");
    showScreen('game__lost');
}



function backToStartScreen() {
    gameStart = false;
    showScreen('game');
    document.getElementById('content').classList.add('content__size');
}


function restartGame() {
    document.getElementById("game__won").classList.add("d-none");
    document.getElementById("game__lost").classList.add("d-none");
    init();
}

function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}


function pauseGame() {
    isPaused = !isPaused;
}


function showControlsIngame() {
    const container = document.getElementById('controls');
    container.classList.toggle('d-none');
    Object.assign(container.style, {
        position: 'absolute',
        inset: '0'
    });
    isPaused = !isPaused;
    if (!back) {
        const containerButton = document.getElementById('controls__back-btn');
        containerButton.onclick = () => showControlsIngameBackButton(containerButton);
    }
    back = !back;
}

function checkOrientation() {
    const container = document.getElementById('landscapeWarning');
    const isLandscape = window.innerWidth >= window.innerHeight;
    const isHeightSmall = window.innerHeight < 933;
    if (isHeightSmall && !isLandscape) {
        container.classList.remove('d-none');
        isPaused = true;
    } else {
        container.classList.add('d-none');
        if (!isPausedResistent) {
            isPaused = false;
        }
    }
}







/* ----------------------------------------------------------------- */









function addTouchEvent(buttonId, action) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[action] = true;
    });
}

function touchScreenTouchStartEvent() {
    addTouchEvent('mobile__left', 'LEFT');
    addTouchEvent('mobile__right', 'RIGHT');
    addTouchEvent('mobile__jump', 'SPACE');
    addTouchEvent('mobile__throw', 'D');
}


function addTouchEndEvent(buttonId, action) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchend', () => {
        keyboard[action] = false;
    });
}

function touchScreenTouchEndEvent() {
    addTouchEndEvent('mobile__left', 'LEFT');
    addTouchEndEvent('mobile__right', 'RIGHT');
    addTouchEndEvent('mobile__jump', 'SPACE');
    addTouchEndEvent('mobile__throw', 'D');
}

