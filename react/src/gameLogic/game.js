import { Player } from './player';
import { MAX_EXECUTION_TIME, PLAYER_TIMEOUT, TURN_TIMEOUT } from './constants';

class Game {
  constructor(players, canvas,multiplayer) {
    this.players = players.map((player,index) => new Player(player.name, player.health, player.energy, player.isDefending, index));
    this.canvas = canvas
    this.ctx = canvas.getContext ? canvas.getContext("2d") : null;
    this.background = new Image();
    this.multiplayer = multiplayer
    this.background.src = multiplayer ? "/sprites/background.png": "/sprites/background_train.png";
    this.loaded = false;
    this.background.onload = () => {
      this.onLoadPlayers();
    }
    this.initPlayers();
  }
  async onLoadPlayers() {
    for (const player of this.players) {
      await player.onLoad;
    }
    this.loaded = true;
    this.draw();
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initPlayers() {
    const newPlayers = [...this.players];
    const screenWidth = this.canvas.width;
    const screenHeight = this.canvas.height;

    // Calcular el número de columnas y filas basado en la cantidad de jugadores
    const numPlayers = newPlayers.length;
    const cols = Math.ceil(Math.sqrt(numPlayers));
    const rows = Math.ceil(numPlayers / cols);

    // Calcular el tamaño de los jugadores basado en el tamaño del canvas
    let playerWidth = screenWidth / cols;
    let playerHeight = screenHeight / rows;

    // hacerlo cuadrado y adaptarlo al menor de los dos
    if (playerWidth > playerHeight) {
      playerWidth = playerHeight
    } else {
      playerHeight = playerWidth;
    }

    newPlayers.forEach((player, index) => {

      //player.action = "idle";

      const col = index % cols;
      const row = Math.floor(index / cols);

      // Calcular la posición x e y basada en la columna y fila
      player.x = (col * screenWidth / cols) + (screenWidth / cols - playerWidth) / 2;
      player.y = (row * screenHeight / rows) + (screenHeight / rows - playerHeight) / 2;
      player.width = playerWidth;
      player.height = playerHeight - 60;
    });

    this.players = newPlayers;
    return newPlayers;
  }
  updatePlayers = (playersData) => {
    const newPlayers = [];
    playersData.forEach((playerData, index) => {
      if (playerData) {

        const player = this.players.find(p => p.name === playerData.name);

        if (player) {
        player.update(playerData);
        newPlayers.push(player);
        }
      }
    });

    this.players = newPlayers;
  }
  deleteDeadPlayers = () => {
    this.players = this.players.filter(player => player.health > 0);
  }
  drawPlayer(player) {
    
    const { x, y,spriteWidth, spriteHeight } = player.getSprite();
    console.log("draw player", player, x, y, spriteWidth, spriteHeight)
    this.ctx.drawImage(player.image, x, y, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
  }
  drawPlayers = () => {
    const ctx = this.ctx;
    this.players.forEach(player => {

      try{
      this.drawPlayer(player);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(player.x, player.y + player.height - 5, player.width, 60);
      ctx.fillStyle = "black";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      if (player.isHurt) ctx.fillStyle = "red";
      if(player.isTurn) ctx.fillStyle = "blue";
      ctx.fillText(`${player.name} ${player.isDefending ? "🛡" : ""}`, player.x + player.width / 2, player.y + player.height + 10);
      ctx.fillText(`Vida: ${player.health}`, player.x + player.width / 2, player.y + player.height + 30);
      ctx.fillText(`Energia: ${player.energy}`, player.x + player.width / 2, player.y + player.height + 50);
      player.isHurt = false;
      }catch(e){

        console.error(e);
      }
    });
  };
  draw = () => {
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayers();
  }
  drawWinners(players) {
    const winners = players.map((player) => {
      console.log("winner",player)
      const winner = this.players.find(p => p.name === player.name)
      winner.wins = player.wins;
      winner.draws = player.draws;
      winner.losses = player.losses;
      return winner
    });
    const ctx = this.ctx;
    const canvas = this.canvas;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el fondo
    ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
    
    // Configurar el estilo del texto
    ctx.fillStyle = "black";
    //ctx.lineWidth = 3;
    ctx.font = "bold 24px";
    ctx.textAlign = "center";
    
    // Dibujar el podio
    const podiumWidth = canvas.width * 0.8;
    const podiumHeight = canvas.height * 0.3;
    const podiumX = (canvas.width - podiumWidth) / 2;
    const podiumY = canvas.height - podiumHeight;
    
    // Segundo lugar (izquierda)
    ctx.fillStyle = "#C0C0C0"; // Plata
    ctx.fillRect(podiumX, podiumY + podiumHeight * 0.2, podiumWidth * 0.3, podiumHeight * 0.8);
    
    // Primer lugar (centro)
    ctx.fillStyle = "#FFD700"; // Oro
    ctx.fillRect(podiumX + podiumWidth * 0.35, podiumY, podiumWidth * 0.3, podiumHeight);
    
    // Tercer lugar (derecha)
    ctx.fillStyle = "#CD7F32"; // Bronce
    ctx.fillRect(podiumX + podiumWidth * 0.7, podiumY + podiumHeight * 0.4, podiumWidth * 0.3, podiumHeight * 0.6);
    
    // Dibujar jugadores y sus estadísticas
    winners.forEach((player, index) => {
      let x, y;
      switch(index) {
        case 0: // Primer lugar
          x = canvas.width / 2;
          y = podiumY ;
          player.x = canvas.width / 2 - player.width / 2;
          player.y = y - player.height ;
          break;
        case 1: // Segundo lugar
          x = podiumX + podiumWidth * 0.15;
          y = podiumY + podiumHeight * 0.2 ;
          player.x = x - player.width / 2;
          player.y = y - player.height ;
          break;
        case 2: // Tercer lugar
          x = podiumX + podiumWidth * 0.85;
          y = podiumY + podiumHeight * 0.4 ;
          player.x = x - player.width / 2;
          player.y = y - player.height ;
          break;
      }
      
      // Dibujar al jugador
      this.drawPlayer(player);
      console.log("paplayer ", player);
      // Dibujar nombre y estadísticas
      ctx.fillStyle = "black";
      ctx.fillText(player.name, x, y + 20);
      ctx.fillText(`Victorias: ${player.wins}`, x, y + 45);
      ctx.fillText(`Empates: ${player.draws}`, x, y + 70);
      ctx.fillText(`Derrotas: ${player.losses}`, x, y + 95);
    });
  }
}
export default Game;
