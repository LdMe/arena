import { MAX_HEALTH, MAX_ENERGY, ATTACK_DAMAGE, ATTACK_ENERGY, DEFENSE_ENERGY, REST_ENERGY } from './constants.js';
import { grupoAzul, grupoVerde, grupoRojo, grupoAmarillo, randomPlay, chatGpt } from './strategies.js';
import userModel from '../models/user.js';
import { generateStrategyCode } from '../utils/strategy.js';
const sprites = {
    attack: 0,
    idle: 1,
    rest: 2
}
const colors = ["amber", "chartreuse", "crimson", "indigo", "magenta", "olive", "periwinkle", "teal", "turquoise", "vermilion"];
function getSprite(index) {
    return "/sprites/" + colors[index] + ".png";
}
export class Player {
    constructor(name, health, energy, isDefending, playStrategy, log) {
        this.name = name;
        this.health = health;
        this.energy = energy;
        this.isDefending = isDefending;
        this.playStrategy = playStrategy;
        this.log = log || console.log;
        this.isTurn = false;
        /* console.log("image src",image)
        this.image = new Image();
        this.image.src = image.src || image; */
        this.action = "idle";
        this.isHurt = false;

    }
    static copy(player) {
        return new Player(player.name, player.health, player.energy, player.isDefending, player.playStrategy, player.log);
    }
    getData() {
        return {
            name: this.name,
            health: this.health,
            energy: this.energy,
            isDefending: this.isDefending,
            playStrategy: this.playStrategy.toString(),
            log: this.log.toString()
        };
    }

    attack(defender) {
        if (this.energy >= ATTACK_ENERGY) {
            this.action = "attack";
            this.energy -= ATTACK_ENERGY;

            this.log(`👊 ${this.name} ha atacado a ${defender.name}.`);
            if (defender.isDefending) {
                defender.isDefending = false;
                defender.action = "idle";
                this.log(`🛡 ${defender.name} ha parado el ataque de ${this.name}.`);
                return;
            }
            defender.health -= ATTACK_DAMAGE;
            defender.health = Math.max(defender.health, 0);
            defender.isHurt = true;
            this.log(`💥 ${defender.name} ha recibido ${ATTACK_DAMAGE} de daño. Vida de ${defender.name}: ${defender.health}.`);
            if (defender.health <= 0) {
                this.log(`😵 ${defender.name} ha muerto.`);
            }
        } else {
            this.log(`💔 ${this.name} no tiene suficiente energía para atacar a ${defender.name}.`);
        }
    }

    defend() {
        if (this.energy >= DEFENSE_ENERGY) {
            this.energy -= DEFENSE_ENERGY;
            this.isDefending = true;
            this.action = "idle";
            this.log(`🛡 ${this.name} se está defendiendo.`);
        } else {
            this.log(`💔 ${this.name} no tiene suficiente energía para defender.`);
        }
    }

    rest() {
        if (this.energy < MAX_ENERGY) {
            this.energy += REST_ENERGY;
            this.energy = Math.min(this.energy, MAX_ENERGY);
            this.action = "rest";
            this.log(`💤 ${this.name} está descansando.`);
        } else {
            this.log(`👀 ${this.name} no puede descansar más.`);
        }
    }
    play(enemies) {
        this.isHurt = false;
        this.playStrategy(this, enemies);
        this.isTurn = false;
        this.action = "idle";
        enemies.forEach((enemy) => {
            enemy.isHurt = false;
        })
    }
}
export function getRandomPlayer(log, index) {
    return new Player("Random " + (index + 1), MAX_HEALTH, MAX_ENERGY, false, randomPlay, log);
}
function getRandomPlayers(log, numPlayers) {
    const players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push(getRandomPlayer(log, i));
    }
    return players;
}
async function getRandomPlayersFromDb(log, numPlayers, excludedUsername) {
    // get a random list of players, excluding the specified user
    const users = await userModel.aggregate([
        { $match: { username: { $ne: excludedUsername }, wins: { $gt: 0 }, draw: { $gt: 0 } } }, // exclude the specified user
        { $sample: { size: parseInt(numPlayers) } }
    ]);

    const players = users.map((user) => new Player(user.username, MAX_HEALTH, MAX_ENERGY, false, generateStrategyCode(user.blocks, true), log));

    if (players.length < numPlayers) {
        const difference = numPlayers - players.length;
        for (let i = 0; i < difference; i++) {
            players.push(new Player("Random " + (i + 1), MAX_HEALTH, MAX_ENERGY, false, randomPlay, log));
        }
    }
    return players;
}
async function getBestPlayers(log, numPlayers, excludedUsername) {
    // get the players with the most wins, and draws
    const users = await userModel.find({ username: { $ne: excludedUsername }, wins: { $gt: 0 }, draw: { $gt: 0 } }).sort({ wins: -1, draw: -1 }).limit(numPlayers);
    const players = users.map((user) => new Player(user.username, MAX_HEALTH, MAX_ENERGY, false, generateStrategyCode(user.blocks, true), log));


    if (players.length < numPlayers) {
        const bestPlayers = [
            { username: "Callo Pie", strategy: grupoAzul },
            { username: "Niebla Roja", strategy: grupoRojo },
            { username: "Amarillo", strategy: grupoAmarillo },
            { username: "Karis", strategy: grupoVerde },
            { username: "Gepeto", strategy: chatGpt }
        ]
        const difference = numPlayers - players.length;
        for (let i = 0; i < Math.min(difference, bestPlayers.length); i++) {
            players.push(new Player(bestPlayers[i].username, MAX_HEALTH, MAX_ENERGY, false, bestPlayers[i].strategy, log));
        }
    }
    return players;
}
export async function createPlayers(log, difficulty, numberOfPlayers = 5, username) {
    switch (difficulty) {
        case "easy":
            return getRandomPlayers(log, numberOfPlayers);
        case "medium":
            return await getRandomPlayersFromDb(log, numberOfPlayers, username);
        case "hard":
            return await getBestPlayers(log, numberOfPlayers, username);
        default:
            return getRandomPlayers(log, numberOfPlayers);
    }
}

export function createPlayer(name, playStrategy, log) {
    return new Player(name, MAX_HEALTH, MAX_ENERGY, false, playStrategy, log);
}
