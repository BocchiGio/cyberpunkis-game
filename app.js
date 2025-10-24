const player = document.getElementById('player');
const smasher = document.getElementById('smasher');
const gameArea = document.getElementById('game-area');

// Configuración
const music = document.getElementById('music'); 
const songSelector = document.getElementById('song-selector');
const btnStatus = document.getElementById('btn-status'); 
const btnsSmasher = document.querySelectorAll('.btn-smasher');
const btnsPlayer = document.querySelectorAll('.btn-player');
const btnPauseGame = document.getElementById('btn-pause-game'); 
const timerDisplay = document.getElementById('timer-display'); 

// Juego
let playerSpeed = 40;
let smasherSpeed = 1;
let playerPosition = { x: 100, y: 100 };
let smasherPosition = { x: 300, y: 300 };
let isGamePaused = true; 

// Timer
const gameTimeLimit = 30000; // 30 segundos
let timeLeft = gameTimeLimit;
let lastTime = Date.now(); // obtener los mili seg actuales para poder medir

function handlePlayerMove(event) {
    if (isGamePaused) return; 

    const key = event.key.toLowerCase(); 
    switch (key){
        case 'w':
            if(playerPosition.y > 0) playerPosition.y -= playerSpeed;
            break;
        case 's':
            if(playerPosition.y < gameArea.clientHeight - 50) playerPosition.y += playerSpeed;
            break;
        case 'a':
            if(playerPosition.x > 0) playerPosition.x -= playerSpeed;
            break;
        case 'd':
            if(playerPosition.x < gameArea.clientWidth - 50) playerPosition.x += playerSpeed;
            break;
    }
    updatePositions();
}

function moveSmasher() {
    if(smasherPosition.x < playerPosition.x){
        smasherPosition.x += smasherSpeed;
    } else if (smasherPosition.x > playerPosition.x){
        smasherPosition.x -= smasherSpeed;
    }
    if (smasherPosition.y < playerPosition.y){
        smasherPosition.y += smasherSpeed;
    } else if (smasherPosition.y > playerPosition.y){
        smasherPosition.y -= smasherSpeed;
    }

    updatePositions();
    checkCollision();
}

function updatePositions() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    smasher.style.transform = `translate(${smasherPosition.x}px, ${smasherPosition.y}px)`;
}

function checkCollision () {
    if (Math.abs(playerPosition.x - smasherPosition.x) < 50 &&
        Math.abs(playerPosition.y - smasherPosition.y) < 50) {
        
        loseGame(); 
    }
}

function gameLoop() {
    if (!isGamePaused) {
        let now = Date.now(); // tiempo actual
        let changeTime = now - lastTime; //tiempo que pasa 
        lastTime = now;
        timeLeft -= changeTime;
        
        if (timeLeft <= 0) {
            timeLeft = 0;
            timerDisplay.textContent = "Tiempo: 0.0";
            winGame();
        } else {
            timerDisplay.textContent = `Tiempo: ${(timeLeft / 1000).toFixed(1)}`;
            moveSmasher(); 
        }
    } else {
        lastTime = Date.now();
    }

    requestAnimationFrame(gameLoop);
}

function togglePauseGame() {
    isGamePaused = !isGamePaused; 

    if (isGamePaused) {
        btnPauseGame.textContent = "Reanudar";
    } else {
        btnPauseGame.textContent = "Pausar";
        lastTime = Date.now();
    }
}

function loseGame() {
    isGamePaused = true; 
    btnPauseGame.textContent = "Reanudar"
    alert('Smasher te mató :(');
    resetGame();
}

function winGame() {
    isGamePaused = true; 
    btnPauseGame.textContent = "Reanudar"; 
    alert('¡LOS SALVASTE :D!');
    resetGame();
}

function resetGame() {
    playerPosition = { x: 100, y: 100 };
    smasherPosition = { x: 300, y: 300 };
    timeLeft = gameTimeLimit; 
    timerDisplay.textContent = `Tiempo: ${(timeLeft / 1000).toFixed(1)}`;
    updatePositions();
}

function songSelection() {
    const selectedSongPath = songSelector.value;
    if (selectedSongPath) {
        music.src = selectedSongPath;
        music.play();
        btnStatus.textContent = "Mute";
    } else {
        music.pause();
        music.src = "";
        btnStatus.textContent = "Play";
    }
}

function musicStatus() {
    if (!music.src) {
        alert("Selecciona una canción");
        return;
    }
    if (music.paused) {
        music.play();
        btnStatus.textContent = "Mute";
    } else {
        music.pause();
        btnStatus.textContent = "Play";
    }
}

function setSmasherSpeed(event) {
    smasherSpeed = parseFloat(event.target.dataset.speed); 
}

function setPlayerSpeed(event) {
    playerSpeed = parseFloat(event.target.dataset.speed);
}

songSelector.addEventListener('change', songSelection);
btnStatus.addEventListener('click', musicStatus);
btnPauseGame.addEventListener('click', togglePauseGame);

btnsSmasher.forEach(function(button) {
    button.addEventListener('click', setSmasherSpeed);
});

btnsPlayer.forEach(function(button) {
    button.addEventListener('click', setPlayerSpeed);
});

gameLoop(); 

window.addEventListener('keydown', handlePlayerMove);

