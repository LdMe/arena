import { Player } from './player.js';
import { MAX_TURNS, PLAYER_TIMEOUT, MAX_ENERGY, MAX_HEALTH } from './constants.js';

class Game {
  constructor(players = [], log = console.log,speed = 1) {
    this.players = players;
    this.ended = false;
    this.log = log;
    this.turnsRemaining = MAX_TURNS * players.length;
    this.speed = speed;
    this.initPlayers();
  }

  setPlayers(players) {
    this.players = players;
    this.turnsRemaining = MAX_TURNS * players.length;
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

    let jugadas = 0;

    while (this.shouldContinue()) {
      const alivePlayers = this.getAlivePlayers();
      jugadas++;

      for (let attacker of alivePlayers) {

        this.turnsRemaining--;
        await this.handleTurn(attacker, alivePlayers);
        if (!this.shouldContinue()) break;
      }
    }

    return this.endGame(jugadas);
  }

  shouldContinue() {
    return this.getAlivePlayers().length > 1 && !this.ended && this.getTurnsRemaining() > 0;
  }

  getTurnsRemaining() {
    return this.turnsRemaining
  }

  async handleTurn(attacker) {
    if (attacker.health <= 0) return;

    attacker.isHurt = false;
    attacker.isTurn = true;
    this.log(`Turno de ${attacker.name}`);

    const enemies = this.getAlivePlayers().filter(player => player.name !== attacker.name);
    attacker.play(enemies);

    await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT / this.speed));
    attacker.isTurn = false;

    if (this.ended || this.getTurnsRemaining() <= 0) return;
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
      if ((Date.now() - startTime) / 1000 > 0.0001) break;

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
    try{
      const enemies = alivePlayers.filter(player => player !== attacker);
      attacker.play(enemies);
    }
    catch(err){
      console.error(err);
    }
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

async function simulateGames(originalPlayers, numSimulations = 1000) {
  const results = initializeResults(originalPlayers);

  for (let i = 0; i < numSimulations; i++) {
    const players = originalPlayers.map(player =>
      new Player(player.name, MAX_HEALTH, MAX_ENERGY, false, player.playStrategy, () => { })
    );

    const game = new Game(players);
    game.setLog(() => { });

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
