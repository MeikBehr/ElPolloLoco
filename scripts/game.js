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
	startGame();
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



async function startGame() {
    if (!isLoading) {
        await newGame();
        setTimeout(() => {
            isLoading = true;
        }, 3000);
    }
}


async function newGame() {
    canvas = document.getElementById('canvas');
    initLevel();
    world = new World(canvas, keyboard);
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

