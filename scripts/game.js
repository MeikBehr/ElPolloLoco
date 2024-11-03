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

/**
 * Shows the main game elements by removing the 'd-none' class 
 * from the content and header elements.
 */
function showElements() {
    document.getElementById('content').classList.remove('d-none');
    document.getElementById('header').classList.remove('d-none');
}

/**
 * Sets the border radius for the canvas and related elements to a specified value 
 * and removes the fullscreen mode class.
 */
function styleCanvasBorderRadius() {
    const canvas = document.getElementById('canvas');
    canvas.style.borderRadius = "2rem";
    canvas.classList.remove('fullscreen-mode');
    document.getElementById('content__canvas').classList.remove('fullscreen-mode');
}

/**
 * Resets the border radius for all elements that have the 'bordRad' class.
 */
function resetBorderRadiusForElements() {
    document.querySelectorAll('.bordRad').forEach(ele => ele.style.borderRadius = '');
}

/**
 * Adjusts the styles for normal screen mode based on whether the game has started.
 */
function styleChangeForNormalScreen() {
    if (!fullscreen && gameStart) {
        showElements();
        styleCanvasBorderRadius();
    }
    
    if (!fullscreen && !gameStart) {
        resetBorderRadiusForElements();
    }
}

/**
 * Starts the game asynchronously by calling the newGame function.
 */
async function startGame() {
    await newGame();
}

/**
 * Initializes a new game level and sets up the game world.
 */
async function newGame() {
    initLevel();
    canvas = document.getElementById('canvas');
    canvas.value = '';
    world = new World(canvas, keyboard);
}

/**
 * Maps key events to corresponding action names for the keyboard.
 */
const keyMap = {
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    ' ': 'SPACE',
    'D': 'D',
    'd': 'D'
};

/**
 * Handles key events and updates the keyboard state based on whether 
 * the key is pressed or released.
 * 
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {boolean} isPressed - Indicates if the key is pressed.
 */
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

/**
 * Maps specific key events to their corresponding actions in the game.
 */
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

/**
 * Handles keydown events to execute game actions based on pressed keys.
 * 
 * @param {KeyboardEvent} event - The keyboard event.
 */
document.addEventListener('keydown', (event) => {
    const action = actionMap[event.key];
    if (action) action();
});

/**
 * Adds event listeners for fullscreen change events to handle style adjustments.
 */
['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => document.addEventListener(event, handleFullscreenChange));

/**
 * Displays the specified screen by hiding all other screens and showing the target one.
 * 
 * @param {string} screenId - The ID of the screen to show.
 */
function showScreen(screenId) {
    const screens = ['game', 'controls', 'about', 'story', 'canvas', 'section__controls', 'game__lost', 'game__won'];

    screens.forEach(screen => {
        const element = document.getElementById(screen);
        if (element) element.classList.add('d-none');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.remove('d-none');
}

/**
 * Handles fullscreen change events and adjusts the game's fullscreen style accordingly.
 */
function handleFullscreenChange() {
    fullscreen = Boolean(document.fullscreenElement);
    fullscreen ? styleChangeForFullScreen() : styleChangeForNormalScreen();
}

/**
 * Requests the browser to enter fullscreen mode for the specified element.
 * 
 * @param {HTMLElement} element - The element to display in fullscreen.
 */
function requestFullscreen(element) {
    const requestFullscreenMethod = element.requestFullscreen || element.mozRequestFullScreen || 
        element.webkitRequestFullscreen || element.msRequestFullscreen;
    if (requestFullscreenMethod) requestFullscreenMethod.call(element);
}

/**
 * Exits the fullscreen mode in the browser.
 */
function exitFullscreen() {
    const exitFullscreenMethod = document.exitFullscreen || document.mozCancelFullScreen || 
        document.webkitExitFullscreen || document.msExitFullscreen;
    if (exitFullscreenMethod) exitFullscreenMethod.call(document);
}

/**
 * Toggles the fullscreen mode for the content element and updates the fullscreen icon.
 */
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

/**
 * Applies styles for fullscreen mode, including hiding specific elements 
 * and adjusting the canvas display properties.
 */
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

/**
 * Resets the border radius for all elements that have the 'bordRad' class to 0px.
 */
function resetBorderRadiusForElements() {
    document.querySelectorAll('.bordRad').forEach(ele => {
        ele.style.borderRadius = '0px';
    });
}

/**
 * Changes the styles for fullscreen mode based on the current game state.
 */
function styleChangeForFullScreen() {
    if (fullscreen) {
        gameStart ? setFullscreenStyles() : resetBorderRadiusForElements();
    }
}

/**
 * Updates the audio icon based on the mute state of the game.
 */
function updateAudioIcons() {
    const audioSrc = isMuted ? './assets/icons/mute.png' : './assets/icons/audio.png';
    document.getElementById('audio-btn').src = audioSrc;
    document.getElementById('audio-btn-mobile').src = audioSrc;
}

/**
 * Toggles the visibility of the mute and unmute buttons based on the mute state.
 */
function toggleMuteButtons() {
    const muteButton = document.getElementById('game__mute-btn');
    const unmuteButton = document.getElementById('game__unmute-btn');
    muteButton.classList.toggle('d-none', isMuted);
    unmuteButton.classList.toggle('d-none', !isMuted);
}

/**
 * Toggles the mute state of the game, stops all sounds if muted, 
 * updates the audio icons, and adjusts the mute button visibility.
 */
function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) stopAllSounds();
    updateAudioIcons();
    toggleMuteButtons();
}

/**
 * Plays a sound if the game is not muted and not paused, 
 * and adds the sound to the active sounds list.
 * 
 * @param {HTMLAudioElement} sound - The sound to be played.
 */
function playSound(sound) {
    if (!isMuted & !isPaused) {
        sound.play();
        activeSounds.push(sound);
    }
}

/**
 * Stops a specific sound, resets its current time, 
 * and removes it from the active sounds list.
 * 
 * @param {HTMLAudioElement} sound - The sound to be stopped.
 */
function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    activeSounds = activeSounds.filter(s => s !== sound);
}

/**
 * Stops all active sounds, resets their current time, 
 * and clears the active sounds list.
 */
function stopAllSounds() {
    activeSounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
    activeSounds = [];
}

/**
 * Configures the back button to show the game screen when clicked.
 * 
 * @param {HTMLElement} containerButton - The button to be configured.
 */
function showControlsIngameBackButton(containerButton) {
    containerButton.onclick = null;
    containerButton.removeAttribute('onclick');
    containerButton.onclick = () => showScreen('game');
    showControlsIngame();
}

/**
 * Displays the screen for winning the game.
 */
function gameWon() {
    showScreen('game__won');
}

/**
 * Displays the screen for losing the game.
 */
function gameLost() {
    document.getElementById('game__lost').classList.remove("d-none");
    showScreen('game__lost');
}

/**
 * Resets the game state and returns to the start screen.
 */
function backToStartScreen() {
    gameStart = false;
    showScreen('game');
    document.getElementById('content').classList.add('content__size');
}

/**
 * Restarts the game by hiding the win/loss screens and initializing a new game.
 */
function restartGame() {
    document.getElementById("game__won").classList.add("d-none");
    document.getElementById("game__lost").classList.add("d-none");
    init();
}

/**
 * Checks if the device is a touch device by looking for touch events.
 * 
 * @returns {boolean} - True if the device supports touch, false otherwise.
 */
function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

/**
 * Toggles the pause state of the game.
 */
function pauseGame() {
    isPaused = !isPaused;
}

/**
 * Toggles the visibility of the control container in-game 
 * and updates the pause state accordingly.
 */
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

/**
 * Checks the screen orientation and displays a warning if in portrait mode 
 * with a height smaller than a specified threshold.
 */
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

/**
 * Adds a touch event listener to a button that updates the keyboard state 
 * when touched.
 * 
 * @param {string} buttonId - The ID of the button to attach the event to.
 * @param {string} action - The keyboard action associated with the button.
 */
function addTouchEvent(buttonId, action) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[action] = true;
    });
}

/**
 * Initializes touch start events for mobile controls.
 */
function touchScreenTouchStartEvent() {
    addTouchEvent('mobile__left', 'LEFT');
    addTouchEvent('mobile__right', 'RIGHT');
    addTouchEvent('mobile__jump', 'SPACE');
    addTouchEvent('mobile__throw', 'D');
}

/**
 * Adds a touch end event listener to a button that updates the keyboard state 
 * when released.
 * 
 * @param {string} buttonId - The ID of the button to attach the event to.
 * @param {string} action - The keyboard action associated with the button.
 */
function addTouchEndEvent(buttonId, action) {
    const button = document.getElementById(buttonId);
    button.addEventListener('touchend', () => {
        keyboard[action] = false;
    });
}

/**
 * Initializes touch end events for mobile controls.
 */
function touchScreenTouchEndEvent() {
    addTouchEndEvent('mobile__left', 'LEFT');
    addTouchEndEvent('mobile__right', 'RIGHT');
    addTouchEndEvent('mobile__jump', 'SPACE');
    addTouchEndEvent('mobile__throw', 'D');
}
