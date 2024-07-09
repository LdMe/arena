import { MAX_HEALTH, MAX_ENERGY, ATTACK_DAMAGE, ATTACK_ENERGY, DEFENSE_ENERGY, REST_ENERGY } from './constants';
import { grupoAzul, grupoVerde, grupoRojo, grupoAmarillo, randomPlay, chatGpt } from './strategies';
const actions = {
    attack: 0,
    idle: 1,
    rest: 2
}
const colors =["amber","chartreuse","crimson","indigo","magenta","olive","periwinkle","teal","turquoise","vermilion"];
function getSprite(index){
    return "/sprites/" + colors[index]+".png";
}
export class Player {
    constructor(name, health, energy, isDefending,  index) {
        this.name = name;
        this.health = health;
        this.energy = energy;
        this.isDefending = isDefending;

        const image = getSprite(index);

        this.image = new Image();
        this.image.src = image.src || image;
        this.onLoad = new Promise(resolve => {
            this.image.onload = () => resolve();
        })
        this.action = "idle";
        this.isHurt = false;
    }
    
    update(playerData) {
        for (const key in playerData) {
            this[key] = playerData[key];
        }
        if(!playerData.isHurt){
            this.isHurt = false;
        }
        if(!playerData.isTurn){
            this.isTurn = false;
        }
    }

    getSprite() {
        const y = this.isDefending ? 0 : 512;
        const x = actions[this.action] * 512;

        return { x, y };
    }
}


