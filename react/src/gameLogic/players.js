import { MAX_HEALTH, MAX_ENERGY } from './constants';
import { grupoAzul, grupoVerde, grupoRojo, grupoAmarillo,randomPlay } from './strategies';
class Player {
    constructor(name, health, energy, isDefending, play, image,) {
        this.name = name;
        this.health = health;
        this.energy = energy;
        this.isDefending = isDefending;
        this.play = play;
        this.image = image;
        this.action = "idle";
    }
}

export function createPlayers(log) {
    return [
        new Player("Callo Pie", MAX_HEALTH, MAX_ENERGY, false, grupoAzul, "../sprites/turquoise.png", log),
        new Player("Karis", MAX_HEALTH, MAX_ENERGY, false, grupoVerde, "../sprites/olive.png",log),
        new Player("Niebla Roja", MAX_HEALTH, MAX_ENERGY, false, grupoRojo, "../sprites/crimson.png",log),
        new Player("Amarillo", MAX_HEALTH, MAX_ENERGY, false, grupoAmarillo, "../sprites/amber.png",log),
        new Player("Randomius", MAX_HEALTH, MAX_ENERGY, false, randomPlay, "../sprites/magenta.png",log),
        new Player("Gepeto", MAX_HEALTH, MAX_ENERGY, false, chatGpt, "../sprites/teal.png",log)
    ];
}

// Aquí puedes agregar las funciones grupoAzul, grupoVerde, etc.
