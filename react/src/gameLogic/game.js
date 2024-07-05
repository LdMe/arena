import { Player } from './player';
import { MAX_EXECUTION_TIME, PLAYER_TIMEOUT, TURN_TIMEOUT } from './constants';

class Game {
  constructor(players, canvas,log) {
    this.players = players.map((player) => Player.copy(player));
    this.ended = false;
    this.canvas = canvas
    this.ctx = canvas.getContext ? canvas.getContext("2d") : null;
    this.background = new Image();
    this.background.src = "/sprites/background.png";
    this.loaded = false;
    this.log = log
    this.background.onload = () => {
      this.loaded = true;
    }
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initPlayers() {
    const newPlayers = this.shuffle(this.players);
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
      console.log("player", player);
      player.action = "idle";

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

  // Devuelve un array con los jugadores vivos
  getAlivePlayers(players) {
    return players.filter(player => player.health > 0);
  }
  stop() {
    console.log("Game stopped");
    this.ended = true;
  }
  getPlayerWithMaxHealth() {
    return this.players.reduce((a, b) => (a.health > b.health ? a : b));
  }
  getPlayersWithMaxHealth() {
    const maxHealth = this.getPlayerWithMaxHealth().health;
    return this.players.filter(player => player.health === maxHealth);
  }
  waitForPlayersLoaded() {

  }
  showPlayersStats(players, ) {
    players.forEach(player => {
      this.log(`${player.name}: Salud = ${player.health}, Energía = ${player.energy}`);
    });
  }
  static async simulate(runs =10,players,canvas){
    const stats = [];
    for (let i = 0; i < runs; i++) {
      const startTime = Date.now();
      const game = new Game(players, canvas,console.log);
      const result = game.mainSimulate(100,startTime);
      stats.push({
        ...result,
        time: Date.now() - startTime
      });
      console.log("run", i, "finished", result);
    }
    console.log("simulation ended")
    return stats
  }
  mainSimulate(execution_time,startTime) {
    this.initPlayers();
    const players = this.players;
    try{
      while(this.getAlivePlayers(players).length > 1){
        if(Date.now() - startTime > execution_time){
          console.log("Execution time exceeded");
          break;
        }
        const alivePlayers = this.getAlivePlayers(players);
        for(let i = 0; i < alivePlayers.length; i++){
          const attacker = alivePlayers[i];
          if(attacker.health <= 0) continue;
          const aliveEnemies = this.getAlivePlayers(players).filter(player => player.name !== attacker.name);
          const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          attacker.attack(randomEnemy);
        }
      }
    }catch(e){
      console.error(e);
    }
    const winners = this.getPlayersWithMaxHealth();
    return {
      status : winners.length > 1 ? "draw" : "win",
      players: winners
    }
  }
  async main( updatePlayers) {
    while (!this.loaded && !this.ended) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    this.log("Comienza la batalla 🏟.");
    this.initPlayers();
    const players = this.players;
    this.draw(players);
    await new Promise(resolve => setTimeout(resolve, 1000));
    let jugadas = 0;
    const startTime = Date.now();
    try {
      while (this.getAlivePlayers(players).length > 1 && !this.ended) {
        if (Date.now() - startTime > MAX_EXECUTION_TIME * players.length) {
          break;
        }
        this.log("Tiempo restante: " + Math.floor((MAX_EXECUTION_TIME * players.length - (Date.now() - startTime)) / 1000) + " segundos.");
        const alivePlayers = this.getAlivePlayers(players);
        jugadas++;
        for (let i = 0; i < alivePlayers.length; i++) {
          const attacker = alivePlayers[i];
          if (attacker.health <= 0) continue;
          this.log(`Turno de ${attacker.name}`);
          const enemies = this.getAlivePlayers(players).filter(player => player.name !== attacker.name);
          attacker.play(enemies);
          if (this.getAlivePlayers(players).length === 1) break;
          await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT));

          this.draw(this.getAlivePlayers(players));
          if (this.ended) break;
        }
        this.showPlayersStats(players);
        updatePlayers([...players]);
        await new Promise(resolve => setTimeout(resolve, TURN_TIMEOUT));
      }
      if (this.ended) {
        this.log("El juego ha terminado.");
      }
      const winners = this.getPlayersWithMaxHealth();
      if (winners.length > 1) {
        this.log(`Ha habido un empate entre los jugadores ${winners.map(winner => winner.name).join(", ")}.`);
      } else {
        const winner = winners[0];
        this.log(`${winner.name} ha vencido a todos sus rivales. Los dioses sonríen ante su hazaña gloriosa. ¡Que las canciones de victoria resuenen en todo el imperio!`);
      }
      return jugadas;
    } catch (err) {
      console.error(err);
    }
  }
  drawPlayers = (players) => {
    const ctx = this.ctx;
    players.forEach(player => {
      try{
      const { x, y } = player.getSprite();
      ctx.drawImage(player.image, x, y, 512, 512, player.x, player.y, player.width, player.height);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(player.x, player.y + player.height - 5, player.width, 60);
      ctx.fillStyle = "black";
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      if (player.isHurt) ctx.fillStyle = "red";
      ctx.fillText(`${player.name} ${player.isDefending ? "🛡" : ""}`, player.x + player.width / 2, player.y + player.height + 10);
      ctx.fillText(`Vida: ${player.health}`, player.x + player.width / 2, player.y + player.height + 30);
      ctx.fillText(`Energia: ${player.energy}`, player.x + player.width / 2, player.y + player.height + 50);
      player.isHurt = false;
      }catch(e){
        console.log("player with error",player)
        console.error(e);
      }
    });
  };
  draw = (players) => {
    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayers(players);
  }
}
export default Game;
