import { Player } from './player.js';
import { MAX_EXECUTION_TIME, PLAYER_TIMEOUT, TURN_TIMEOUT } from './constants.js';

class Game {
  constructor(players, log) {
    this.players = players;
    this.ended = false;
    this.log = log
    this.initPlayers();
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
    this.players = newPlayers;
    return;
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
    //this.initPlayers();
    this.players = this.s
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
    
    this.log("Comienza la batalla 🏟.");
    const players = this.players;
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
          attacker.isHurt = false;
          attacker.isTurn = true;
          this.log(`Turno de ${attacker.name}`);
          const enemies = this.getAlivePlayers(players).filter(player => player.name !== attacker.name);
          attacker.play(enemies);
          if (this.getAlivePlayers(players).length === 1) break;
          await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT));
          attacker.isTurn = false;
          if (this.ended) break;
        }
        updatePlayers(this.getAlivePlayers(players));
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

}
export default Game;
