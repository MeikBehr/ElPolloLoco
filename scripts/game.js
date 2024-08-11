"use strict";

let canvas;
let world;
let level;
let keyboard = new Keyboard();
let isLoading = false;
let isMuted = false;
let fullscreen = false;



function init() {
	canvas = document.getElementById('canvas');
	checkOrientation();
	showScreen('canvas');
	startGame();
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




function showScreen(showMe) {
	document.getElementById('canvas').classList.add('d-none');
	document.getElementById('game').classList.add('d-none');
	document.getElementById('controls').classList.add('d-none');
	document.getElementById('about').classList.add('d-none');
	document.getElementById('game__lost').classList.add('d-none');
	document.getElementById('game__won').classList.add('d-none');
    document.getElementById(showMe).classList.remove('d-none');
}




function toggleFullscreen() {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari und Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari und Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}
