import { MAX_HEALTH, MAX_ENERGY, ATTACK_DAMAGE, ATTACK_ENERGY, DEFENSE_ENERGY, REST_ENERGY } from './constants.js';
import { grupoAzul, grupoVerde, grupoRojo, grupoAmarillo, randomPlay, chatGpt } from './strategies.js';
const sprites = {
    attack: 0,
    idle: 1,
    rest: 2
}
const colors =["amber","chartreuse","crimson","indigo","magenta","olive","periwinkle","teal","turquoise","vermilion"];
function getSprite(index){
    return "/sprites/" + colors[index]+".png";
}
export class Player {
    constructor(name, health, energy, isDefending, playStrategy,  log) {
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
        return new Player(player.name, player.health, player.energy, player.isDefending, player.playStrategy,  player.log);
    }
    getData() {
        return {
            name: this.name,
            health: this.health,
            energy: this.energy,
            isDefending: this.isDefending,
            playStrategy: this.playStrategy.toString(),
            log : this.log.toString()
        };
    }

    attack(defender) {
        if (this.energy >= ATTACK_ENERGY) {
            this.action = "attack";
            this.energy -= ATTACK_ENERGY;
            
            if (defender.isDefending) {
                defender.isDefending = false;
                defender.action = "idle";
                this.log(`🛡 ${defender.name} ha parado el ataque de ${this.name}.`);
                return;
            }
            defender.health -= ATTACK_DAMAGE;
            defender.health = Math.max(defender.health, 0);
            defender.isHurt = true;
            this.log(`👊 ${this.name} ha atacado a ${defender.name}.`);
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


export function createPlayers(log,random=false,numberOfPlayers=5) {
    if (random) {
        const players = [];
        for (let i = 0; i < numberOfPlayers; i++) {
            players.push(new Player("Random "+ (i + 1), MAX_HEALTH, MAX_ENERGY, false, randomPlay, log));
        }
        return players;
    }
    const players = [
        new Player("Callo Pie", MAX_HEALTH, MAX_ENERGY, false, grupoAzul, log),
        new Player("Karis", MAX_HEALTH, MAX_ENERGY, false, grupoVerde,  log),
        new Player("Niebla Roja", MAX_HEALTH, MAX_ENERGY, false, grupoRojo,  log),
        new Player("Amarillo", MAX_HEALTH, MAX_ENERGY, false, grupoAmarillo,  log),
        new Player("Randomius", MAX_HEALTH, MAX_ENERGY, false, randomPlay,  log),
        new Player("ChatGPT", MAX_HEALTH, MAX_ENERGY, false, chatGpt,  log),
        //new Player("Gepeto", MAX_HEALTH, MAX_ENERGY, false, chatGpt,  log)
    ];

    return players;
}
export function createPlayer(name,playStrategy,log) {
    return new Player(name, MAX_HEALTH, MAX_ENERGY, false, playStrategy,  log);
}
