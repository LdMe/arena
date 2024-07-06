/* import { Player } from './player.js';
import { MAX_EXECUTION_TIME, PLAYER_TIMEOUT,MAX_ENERGY, MAX_HEALTH } from './constants.js';

class Game {
  constructor(players = [], log = null) {
    this.players = players;
    this.ended = false;
    this.log = log
    this.initPlayers();
  }
  setPlayers(players) {
    this.players = players
    this.initPlayers();
  }
  setLog(log) {
    this.log = log
  }
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initPlayers() {
    this.players = this.shuffle(this.players);
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

  showPlayersStats(players,) {
    players.forEach(player => {
      this.log(`${player.name}: Salud = ${player.health}, Energía = ${player.energy}`);
    });
  }

  async main() {
    this.log("Comienza la batalla 🏟.");
    const players = this.players;
    await new Promise(resolve => setTimeout(resolve, 1000));
    let jugadas = 0;
    const startTime = Date.now();
    try {
      while (this.getAlivePlayers(players).length > 1 && !this.ended) {
        if (this.timeRemaining <= 0) {
          break;
        }
        this.log("Tiempo restante: " + Math.floor((MAX_EXECUTION_TIME * players.length - (Date.now() - startTime)) / 1000) + " segundos.");
        const alivePlayers = this.getAlivePlayers(players);
        jugadas++;
        for (let i = 0; i < alivePlayers.length; i++) {
          this.timeRemaining = Math.floor((MAX_EXECUTION_TIME * players.length - (Date.now() - startTime)) / 1000);
          if (this.timeRemaining <= 0) {
            break;
          }
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
      }
      if (this.ended) {
        this.log("El juego ha terminado.");
      }
      const winners = this.getPlayersWithMaxHealth();
      if (winners.length > 1) {
        this.log(`Ha habido un empate entre los jugadores ${winners.map(winner => winner.name).join(", ")}.`);
      } else {
        const winner = winners[0];
        winner.action = "attack";
        this.log(`${winner.name} ha vencido a todos sus rivales. Los dioses sonríen ante su hazaña gloriosa. ¡Que las canciones de victoria resuenen en todo el imperio!`);
      }
      return {
        status: winners.length > 1 ? "draw" : "win",
        players: winners,
        turns: jugadas,
      }
    } catch (err) {
      console.error(err);
    }
  }
  async simulateMain() {
    const players = this.players;
    let jugadas = 0;
    const startTime = Date.now();
    
    while (this.getAlivePlayers(players).length > 1 && !this.ended) {
      if ((Date.now() - startTime) / 1000 > 0.01) {
        break;
      }
      
      const alivePlayers = this.getAlivePlayers(players);
      jugadas++;
      
      for (let attacker of alivePlayers) {
        if (attacker.health <= 0) continue;
        const enemies = alivePlayers.filter(player => player !== attacker);
        attacker.play(enemies);
        if (this.getAlivePlayers(players).length === 1) break;
      }
    }

    const winners = this.getPlayersWithMaxHealth();
    return {
      status: winners.length > 1 ? "draw" : "win",
      players: winners,
      turns: jugadas,
    };
  }

}

async function simulateGames(originalPlayers, numSimulations = 100) {
  const results = {
    wins: {},
    losses: {},
    draws: {},
    averageTurns: 0,
  };

  originalPlayers.forEach(player => {
    results.wins[player.name] = 0;
    results.losses[player.name] = 0;
    results.draws[player.name] = 0;
  });

  for (let i = 0; i < numSimulations; i++) {
    const players = originalPlayers.map(player => 
      new Player(player.name, MAX_HEALTH, MAX_ENERGY, false, player.playStrategy, () => {})
    );

    const game = new Game(players);
    game.setLog(() => {});

    const { status, players: winners, turns } = await game.simulateMain();

    if (status === "win") {
      results.wins[winners[0].name]++;
      players.forEach(player => {
        if (player.name !== winners[0].name) {
          results.losses[player.name]++;
        }
      });
    } else if (status === "draw") {
      winners.forEach(winner => {
        results.draws[winner.name]++;
      });
      players.forEach(player => {
        if (!winners.some(w => w.name === player.name)) {
          results.losses[player.name]++;
        }
      });
    }

    results.averageTurns += turns;
  }

  results.averageTurns /= numSimulations;

  return results;
}


export default Game;
export { simulateGames }; */

import { Player } from './player.js';
import { MAX_EXECUTION_TIME, PLAYER_TIMEOUT, MAX_ENERGY, MAX_HEALTH } from './constants.js';

class Game {
  constructor(players = [], log = console.log) {
    this.players = players;
    this.ended = false;
    this.log = log;
    this.initPlayers();
  }

  setPlayers(players) {
    this.players = players;
    this.initPlayers();
  }

  setLog(log) {
    this.log = log;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  initPlayers() {
    this.players = this.shuffle(this.players);
  }

  getAlivePlayers() {
    return this.players.filter(player => player.health > 0);
  }

  stop() {
    this.log("Game stopped");
    this.ended = true;
  }

  getPlayerWithMaxHealth() {
    return this.players.reduce((a, b) => (a.health > b.health ? a : b));
  }

  getPlayersWithMaxHealth() {
    const maxHealth = this.getPlayerWithMaxHealth().health;
    return this.players.filter(player => player.health === maxHealth);
  }

  showPlayersStats(players) {
    players.forEach(player => {
      this.log(`${player.name}: Salud = ${player.health}, Energía = ${player.energy}`);
    });
  }

  async main() {
    this.log("Comienza la batalla 🏟.");
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startTime = Date.now();
    let jugadas = 0;

    while (this.shouldContinue(startTime)) {
      this.log(`Tiempo restante: ${this.getTimeRemaining(startTime)} segundos.`);
      const alivePlayers = this.getAlivePlayers();
      jugadas++;

      for (let attacker of alivePlayers) {
        await this.handleTurn(attacker, alivePlayers, startTime);
        if (this.getAlivePlayers().length === 1 || this.ended) break;
      }
    }

    return this.endGame(jugadas);
  }

  shouldContinue(startTime) {
    return this.getAlivePlayers().length > 1 && !this.ended && this.getTimeRemaining(startTime) > 0;
  }

  getTimeRemaining(startTime) {
    return Math.floor((MAX_EXECUTION_TIME * this.players.length - (Date.now() - startTime)) / 1000);
  }

  async handleTurn(attacker, alivePlayers, startTime) {
    if (attacker.health <= 0) return;

    attacker.isHurt = false;
    attacker.isTurn = true;
    this.log(`Turno de ${attacker.name}`);

    const enemies = this.getAlivePlayers().filter(player => player.name !== attacker.name);
    attacker.play(enemies);

    await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT));
    attacker.isTurn = false;

    if (this.ended || this.getTimeRemaining(startTime) <= 0) return;
  }

  endGame(jugadas) {
    if (this.ended) {
      this.log("El juego ha terminado.");
    }

    const winners = this.getPlayersWithMaxHealth();
    const status = winners.length > 1 ? "draw" : "win";
    const winnerMessage = winners.length > 1
      ? `Ha habido un empate entre los jugadores ${winners.map(winner => winner.name).join(", ")}.`
      : `${winners[0].name} ha vencido a todos sus rivales. ¡Que las canciones de victoria resuenen en todo el imperio!`;

    this.log(winnerMessage);

    return {
      status,
      players: winners,
      turns: jugadas,
    };
  }

  async simulateMain() {
    const startTime = Date.now();
    let jugadas = 0;

    while (this.getAlivePlayers().length > 1 && !this.ended) {
      if ((Date.now() - startTime) / 1000 > 0.01) break;

      const alivePlayers = this.getAlivePlayers();
      jugadas++;

      for (let attacker of alivePlayers) {
        this.simulateTurn(attacker, alivePlayers);
        if (this.getAlivePlayers().length === 1) break;
      }
    }

    return this.endSimulation(jugadas);
  }

  simulateTurn(attacker, alivePlayers) {
    if (attacker.health <= 0) return;
    const enemies = alivePlayers.filter(player => player !== attacker);
    attacker.play(enemies);
  }

  endSimulation(jugadas) {
    const winners = this.getPlayersWithMaxHealth();
    return {
      status: winners.length > 1 ? "draw" : "win",
      players: winners,
      turns: jugadas,
    };
  }
}

async function simulateGames(originalPlayers, numSimulations = 100) {
  const results = initializeResults(originalPlayers);

  for (let i = 0; i < numSimulations; i++) {
    const players = originalPlayers.map(player =>
      new Player(player.name, MAX_HEALTH, MAX_ENERGY, false, player.playStrategy, () => {})
    );

    const game = new Game(players);
    game.setLog(() => {});

    const { status, players: winners, turns } = await game.simulateMain();
    updateResults(results, status, winners, players);

    results.averageTurns += turns;
  }

  results.averageTurns /= numSimulations;

  return results;
}

function initializeResults(originalPlayers) {
  const results = {
    wins: {},
    losses: {},
    draws: {},
    averageTurns: 0,
  };

  originalPlayers.forEach(player => {
    results.wins[player.name] = 0;
    results.losses[player.name] = 0;
    results.draws[player.name] = 0;
  });

  return results;
}

function updateResults(results, status, winners, players) {
  if (status === "win") {
    results.wins[winners[0].name]++;
    players.forEach(player => {
      if (player.name !== winners[0].name) {
        results.losses[player.name]++;
      }
    });
  } else if (status === "draw") {
    winners.forEach(winner => {
      results.draws[winner.name]++;
    });
    players.forEach(player => {
      if (!winners.some(w => w.name === player.name)) {
        results.losses[player.name]++;
      }
    });
  }
}

export default Game;
export { simulateGames };
