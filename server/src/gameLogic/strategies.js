import { MAX_ENERGY, MAX_HEALTH, ATTACK_DAMAGE, ATTACK_ENERGY, DEFENSE_ENERGY, REST_ENERGY } from "./constants.js";

const randomPlay = function (player, enemies) {
    // randomly attack, defend, or rest
    const randomNumber = Math.random();
    if (randomNumber < 0.33) {
        let enemy = enemies[Math.floor(Math.random() * enemies.length)];
        while (enemy.name === player.name) {
            enemy = enemies[Math.floor(Math.random() * enemies.length)];
        }
        return player.attack(enemy);
    }
    else if (randomNumber < 0.66) {
        return player.defend();
    }
    else {
        return player.rest();
    }
}
const grupoAzul = function (player, enemies) {
    if (player.energy < 20) {
        return player.rest()
    }
    if (player.isDefending === false && player.energy >= 20) {

        return player.defend();
    }
    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
    while (enemy.name === player.name) {
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
    }
    return player.attack(enemy);


}
function grupoVerde(player, enemies) {


    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
    while (enemy.name === player.name) {
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
    }
    if (player.health >= 60 && player.energy >= 40) {
        if (player.isDefending === false) {
            return player.attack(enemy);
        } else {
            return player.defend();
        }

    } else if (player.health > 20 && player.health < 40) {
        if (enemy.health > 50) {
            if (player.isDefending === false) {
                return player.attack(enemy);
            } else {
                return player.rest();
            }
        }
        return player.defend();

    } else if (player.energy <= 20) {
        return player.rest();

    } else {
        if (player.isDefending === false) {
            return player.attack(enemy);
        } else {
            return player.rest();
        }
    }
}
const grupoRojo = function (player, enemies) {
    let estamosProtegidos = player.isDefending;
    let nuestraEnergia = player.energy;
    let enemigosDesprotegidos = [];
    let enemigosProtegidos = [];
    let menorSalud = MAX_HEALTH + 1;
    let enemigoAtacar = [];

    if (estamosProtegidos != true) {
        return player.defend();
    }
    else if (nuestraEnergia <= 50) {
        return player.rest();
    }
    else if (nuestraEnergia > 50) {
        for (let i = 0; i < enemies.length; i++) {

            if (enemies[i].name != player.name) {
                if (enemies[i].isDefending === false) {
                    enemigosDesprotegidos.push(enemies[i]);

                }
            }

        }
        if (enemigosDesprotegidos.length === 0) {

            let numeroAleatorio = Math.floor(Math.random() * enemigosDesprotegidos.length);
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].name != player.name) {
                    enemigosProtegidos.push(enemies[i]);
                }

            }

            enemigoAtacar = enemigosProtegidos[numeroAleatorio];

        } else {

            for (let index = 0; index < enemigosDesprotegidos.length; index++) {
                if (enemigosDesprotegidos[index].health < menorSalud) {
                    menorSalud = enemigosDesprotegidos[index].health;
                    enemigoAtacar = enemigosDesprotegidos[index];
                }

            }

        }

        return player.attack(enemigoAtacar);
    }
}
const grupoAmarillo = function (player, enemies) {


    const randomNumber = Math.random();
    if (player.energy <= 25) {

        return player.rest();
    } else if (randomNumber < 0.9) {
        let weakestEnemy = null;


        const weakestEnemi = enemies.filter(enemy => enemy.name !== player.name);
        const weakestEnemies = weakestEnemi.filter(enemy => enemy.health == Math.min(...weakestEnemi.map(enemy => enemy.health)));



        weakestEnemy = weakestEnemies[Math.floor(Math.random() * weakestEnemies.length)];

        return player.attack(weakestEnemy);
    } else
        return player.defend();
};
function chatGpt(player, enemies) {
    // Calcula la puntuación de cada oponente basándose en su salud y energía
    const scores = enemies.map(enemy => {
        let score = (enemy.health / MAX_HEALTH) * 0.6 + (enemy.energy / MAX_ENERGY) * 0.4;
        // Penaliza a los jugadores que estén defendiendo
        if (enemy.isDefending) {
            score *= 0.8;
        }
        return { enemy, score };
    });

    // Ordena los oponentes por puntuación de forma ascendente
    scores.sort((a, b) => a.score - b.score);

    // Decide la acción basándose en la estrategia
    if (player.energy >= ATTACK_ENERGY) {
        // Ataca al oponente con la puntuación más alta
        player.attack( scores[scores.length - 1].enemy);
    } else if (player.energy >= DEFENSE_ENERGY && player.health < MAX_HEALTH * 0.8) {
        // Si no puede atacar pero tiene suficiente energía, defiéndete si la salud es baja
        player.defend();
    } else {
        // Si no puede atacar ni defender, descansa
        player.rest();
    }
}

export {
    grupoAmarillo,
    grupoRojo,
    grupoVerde,
    chatGpt,
    grupoAzul,
    randomPlay
}