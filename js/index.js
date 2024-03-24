

const MAX_ENERGY = 100;
const MAX_HEALTH = 100;
const ATTACK_DAMAGE = 20;
const ATTACK_ENERGY = 25;
const DEFENSE_ENERGY = 15;
const REST_ENERGY = 20;
const PLAYER_TIMEOUT = 1000;
const TURN_TIMEOUT = 1000;
const MAX_EXECUTION_TIME = 500;

function attack(attacker,defender) {

  if (attacker.energy >= ATTACK_ENERGY) {
    attacker.action="attack";
    attacker.energy -= ATTACK_ENERGY;
    log(`👊 ${attacker.name} ha atacado a ${defender.name}. `);
    if(defender.isDefending) {
      log(`🛡 ${defender.name} ha parado el ataque de ${attacker.name}. `);
      
      defender.isDefending = false;
      defender.action="idle";
      return;
    }
    defender.health -= ATTACK_DAMAGE;
    defender.health = Math.max(defender.health, 0);
    defender.isHurt=true;
    
    log(`💥 ${defender.name} ha recibido ${ATTACK_DAMAGE} de daño. Vida de ${defender.name}: ${defender.health}.`);
    if(defender.health <= 0) {
      log(`😵 ${defender.name} ha muerto. `);
    }
  } else {
    log(`💔 ${attacker.name} no tiene suficiente energía para atacar a ${defender.name}.`);
  }
  return ;
}

function defend(defender) {
  if (defender.energy >= DEFENSE_ENERGY) {
    defender.energy -= DEFENSE_ENERGY;
    defender.isDefending = true;
    defender.action="idle";
    log(`🛡 ${defender.name} se está defendiendo.`);
  } else {
    log(`💔 ${defender.name} no tiene suficiente energía para defender.`);
  }
  return ;
}

function rest(player) {
  if (player.energy < MAX_ENERGY) {
    player.energy += REST_ENERGY;
    player.energy = Math.min(player.energy, MAX_ENERGY);
    player.action="rest";
    log(`💤 ${player.name} está descansando.`);
  } else {
    log(`👀 ${player.name} no puede descansar más.`);
  }
  return ;
}
function getAlivePlayers(players) {
  return players.filter(player => player.health > 0);
}
// 4 players

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function showPlayersStats(players) {
  let result = "Estado de los jugadores:<br>";
  players.forEach(player => {
    result += `${player.name}: ${player.health} vida | ${player.energy} energía | ${player.isDefending ? "🛡" : ""}\n`;
  });
  
  log(result);
}
async function main(players) {
  log("Comienza la batalla 🏟.");
  const startTime = Date.now();
  let jugadas = 0;
  while(getAlivePlayers(players).length > 1) {
    if(Date.now() - startTime > MAX_EXECUTION_TIME) {
      // log("$$$$$$$$$$$$$$$$$$$$$$$$$$\nEl juego ha terminado.\n$$$$$$$$$$$$$$$$$$$$$$$$$$\n");
      break;
    }
    const alivePlayers = getAlivePlayers(players);
    jugadas++;
    for (let i = 0; i < alivePlayers.length; i++) {
      const attacker = alivePlayers[i];
      if(attacker.health <= 0) {
        continue;
      }
      log(`Turno de ${attacker.name}`);
      attacker.play(attacker, getAlivePlayers(players));
      // log(`---------------`);
      if(getAlivePlayers(players).length === 1) {
        // log("$$$$$$$$$$$$$$$$$$$$$$$$$$\nEl juego ha terminado.\n$$$$$$$$$$$$$$$$$$$$$$$$$$\n");
        break;
      }
      await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT));
      
    }
    showPlayersStats(players);
    await new Promise(resolve => setTimeout(resolve, TURN_TIMEOUT));
  }
  const winner = getAlivePlayers(players)[0];
  log(`${winner.name} ha vencido a todos sus rivales.\nLos dioses sonríen ante su hazaña gloriosa.<br>¡Que las canciones de victoria resuenen en todo el imperio!`);
  return jugadas;
}
const randomPlay = function(player,enemies) {
  // randomly attack, defend, or rest
  const randomNumber = Math.random();
  if(randomNumber < 0.33) {
    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
    while(enemy.name===player.name) {
      enemy = enemies[Math.floor(Math.random() * enemies.length)];
    }
    return attack(player,enemy);
  }
  else if(randomNumber < 0.66) {
   return defend(player);
  }
  else {
    return rest(player);
  }
}
const grupoAzul = function(player,enemies) {
    if (player.energy < 15){
      return rest(player)
    }
    if (player.isDefending === false && player.energy >= 15){

    return defend(player)
    }

    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
      while(enemy.name===player.name) {
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
      }
      return attack(player,enemy);


}
function grupoVerde (player, enemies) {
    let enemy = enemies[Math.floor(Math.random() * enemies.length)];
    while(enemy.name===player.name) {
        enemy = enemies[Math.floor(Math.random() * enemies.length)];
    }
      if (player.health >= 60 && player.energy >=40) {
          if (player.isDefending === false) {
              return attack(player, enemy);
          } else {
              return defend(player);
          }
  
      } else if (player.health > 20 && player.health < 40) {
          if (enemy.health > 50) {
              if (player.isDefending === false) {
                  return attack(player, enemy);
              } else {
                  return rest(player);
              }
          }
          return defend(player);
          
      } else if (player.energy <= 20) {
          return rest(player);
      
      } else {
          if (player.isDefending === false) {
              return attack(player, enemy);
          } else {
            return rest(player);
          }
      }
}
const grupoRojo = function(player,enemies) {
  let estamosProtegidos =  player.isDefending;
  let nuestraEnergia = player.energy;
  let enemigosDesprotegidos = [];
  let enemigosProtegidos = [];
  let menorSalud = MAX_HEALTH + 1;
  let enemigoAtacar = []; 

  if(estamosProtegidos != true) {
      return defend(player);
  }
  else if(nuestraEnergia <= 50) {
    return rest(player);
  }
  else if( nuestraEnergia > 50) {
      for (let i = 0; i < enemies.length; i++){

          if(enemies[i].name != player.name){
              if (enemies[i].isDefending === false){
                  enemigosDesprotegidos.push(enemies[i]);
                  
              }
          }

      }
      if(enemigosDesprotegidos.length === 0){
      
          let numeroAleatorio = Math.floor(Math.random() * enemigosDesprotegidos.length);   
          for (let i = 0; i < enemies.length; i++){
              if(enemies[i].name != player.name){
                  enemigosProtegidos.push(enemies[i]);
              }
  
          }
          
          enemigoAtacar = enemigosProtegidos[numeroAleatorio];

      }else{
          
          for (let index = 0; index < enemigosDesprotegidos.length; index++) {
              if(enemigosDesprotegidos[index].health < menorSalud){
                  menorSalud = enemigosDesprotegidos[index].health;
                  enemigoAtacar = enemigosDesprotegidos[index];
              }
              
          }
          
      }
      
      return attack(player, enemigoAtacar);
  }
}
const grupoAmarillo = function(player,enemies) {


  const randomNumber = Math.random();
  if (player.energy <= 25) {

      return rest(player);
  } else if (randomNumber < 0.9) { 
      let weakestEnemy = null;


      const weakestEnemi = enemies.filter(enemy => enemy.name !== player.name);
      const weakestEnemies = weakestEnemi.filter(enemy => enemy.health == Math.min(...weakestEnemi.map(enemy => enemy.health)));



        weakestEnemy = weakestEnemies[Math.floor(Math.random() * weakestEnemies.length)];

      return attack(player, weakestEnemy);
  } else 
  return defend(player);
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
        attack(player, scores[scores.length - 1].enemy);
    } else if (player.energy >= DEFENSE_ENERGY && player.health < MAX_HEALTH * 0.8) {
        // Si no puede atacar pero tiene suficiente energía, defiéndete si la salud es baja
        defend(player);
    } else {
        // Si no puede atacar ni defender, descansa
        rest(player);
    }
}
const sprites={
    attack:0,
    idle:1,
    rest:2
}
function getSprite(action,isDefending,sizeX=512,sizeY=512){
  const y = isDefending ? 0 : sizeY;
  const x = sprites[action] * sizeX;
  return {x,y};
}

class Player {
  constructor(name, health, energy, isDefending, play,image,x=0,y=0,width=150,height=150) {
    this.name = name;
    this.health = health;
    this.energy = energy;
    this.isDefending = isDefending;
    this.play = play;

    this.image = new Image();
    this.image.src = image;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.loaded = false;

    this.image.onload = () => {
      this.loaded = true;
    };
    
  }
}

function createPlayers(canvas) {
  const players = [
    new Player("Callo Pie", MAX_HEALTH, MAX_ENERGY, false, grupoAzul,"../sprites/turquoise.png"),
    new Player("Karis", MAX_HEALTH, MAX_ENERGY, false, grupoVerde,"../sprites/olive.png"),
    new Player("Niebla Roja", MAX_HEALTH, MAX_ENERGY, false, grupoRojo,"../sprites/crimson.png"),
    new Player("Amarillo", MAX_HEALTH, MAX_ENERGY, false, grupoAmarillo,"../sprites/amber.png"),
    new Player("Randomius", MAX_HEALTH, MAX_ENERGY, false, randomPlay,"../sprites/magenta.png"),
    new Player("Gepeto", MAX_HEALTH, MAX_ENERGY, false, chatGpt,"../sprites/teal.png")
  ];
  // inicializa las coordenadas de los jugadores
  players.forEach((player, index) => {
    player.action= "idle";
    const screenWidth = canvas.width;
    player.x = ((index % 2) * (screenWidth - 200)) +10;
    player.y = canvas.height - 210 - (200 *(index % 3));
  });

  return players;
}

const deepCopyPlayers = (array) =>{
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push({ ...array[i] });
  }
  return newArray;
} 

// guardar el resultado en un archivo json
function drawPlayer(player, action,ctx) {
  const { x, y } = getSprite(action, player.isDefending, 512, 512);
  ctx.drawImage(player.image, x, y, 512, 512, player.x, player.y, player.width, player.height);

  //first draw a semi-transparent rectangle for the text to be readable
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(player.x, player.y + player.height -5, player.width, 60);

  // write player name, health and energy under the player
  ctx.fillStyle = "black";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  
  if(player.isHurt) {
    ctx.fillStyle = "red";
  }
  
  ctx.fillText(player.name + " " +(player.isDefending ? "🛡" : ""), player.x + player.width / 2, player.y + player.height+10 );
  ctx.fillText(`Vida: ${player.health}`, player.x + player.width / 2, player.y + player.height  + 30);
  ctx.fillText(`Energia: ${player.energy}`, player.x + player.width / 2, player.y + player.height  + 50);
  player.isHurt = false;
}
function drawPlayers(players, ctx) {
  players.forEach(player => {
    drawPlayer(player, player.action, ctx);
  });
}

function draw(background, players, ctx) {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  drawPlayers(players, ctx);
}
let ended = true;

log = text => {
  const log = document.getElementById("log");
  log.innerHTML += "<br>" + text;
  log.scrollTop = log.scrollHeight;
}

async function mainDOM() {
  log("Comienza la batalla");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const background = new Image();
  background.src = "../sprites/background.png";
  const players = shuffle(createPlayers(canvas)); 

  await new Promise(resolve => setTimeout(resolve, 1000));
  draw(background, players, ctx);

  while(getAlivePlayers(players).length > 1 && !ended) {
    const alivePlayers = getAlivePlayers(players);
    for (let i = 0; i < alivePlayers.length; i++) {
      if(ended) {
        break;
      }
      const attacker = alivePlayers[i];
      attacker.action = "idle";
      attacker.play(attacker, getAlivePlayers(players));
      if(getAlivePlayers(players).length === 1) {
        break;
      }
      draw(background, alivePlayers, ctx);
      await new Promise(resolve => setTimeout(resolve, PLAYER_TIMEOUT));
    }
  }


}

const button = document.getElementById("start");
button.addEventListener("click", ()=>{
  if(ended) {
    mainDOM();
    ended = false;
    button.innerHTML = "Finalizar";
  }
  else {
    ended = true;
    button.innerHTML = "Comenzar";
  }
});
