import Game, { simulateGames } from "../gameLogic/game.js";
import { createPlayers, createPlayer } from "../gameLogic/player.js";
import { generateStrategyCode } from "../utils/strategy.js";
import userController from "./userController.js";

async function updatePlayerStats(players, mainGameResult, simResults) {
  const { players: winners, status } = mainGameResult;
  const numSimulations = Object.values(simResults.wins)[0] + Object.values(simResults.losses)[0] + Object.values(simResults.draws)[0];

  for (const player of players) {
    const dbPlayer = await userController.getUserByUsername(player.name);
    if (!dbPlayer) continue;

    const newData = {
      totalGames: dbPlayer.totalGames + 1 + numSimulations,
      won: dbPlayer.won + (status === "win" && winners[0].name === player.name ? 1 : 0) + simResults.wins[player.name],
      lost: dbPlayer.lost + (status !== "draw" && !winners.some(w => w.name === player.name) ? 1 : 0) + simResults.losses[player.name],
      draw: dbPlayer.draw + (status === "draw" ? 1 : 0) + simResults.draws[player.name]
    };

    await userController.updateUser(player.name, newData);
  }
}
function processResults(mainGameResult, simulationResults) {
  const playerStats = {};

  // Procesar el resultado del juego principal
  const { players: winners, status } = mainGameResult;
  for (const player of Object.keys(simulationResults.wins)) {
    playerStats[player] = {
      name: player,
      wins: status === "win" && winners[0].name === player ? 1 : 0,
      draws: status === "draw" ? 1 : 0,
      losses: status !== "draw" && !winners.some(w => w.name === player) ? 1 : 0
    };
  }

  // Añadir resultados de las simulaciones
  for (const player of Object.keys(simulationResults.wins)) {
    playerStats[player].wins += simulationResults.wins[player];
    playerStats[player].draws += simulationResults.draws[player];
    playerStats[player].losses += simulationResults.losses[player];
  }

  // Convertir a array y ordenar
  const sortedStats = Object.values(playerStats).sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins; // Ordenar por victorias (descendente)
    } else {
      return b.draws - a.draws; // Si hay empate en victorias, ordenar por empates (descendente)
    }
  });

  return sortedStats;
}

const init = async (strategy, socket = null,socketListener = null) => {
  console.log("strategy", strategy);
  let players = [];
  const newGame = new Game();

  let log = (...args) => console.log(...args);
  if (socket) {
    log = (...args) => {
      console.log(...args);
      socket.emit("log", { log: [...args], players, turnsRemaining: newGame.turnsRemaining });
    };
  }
  newGame.setLog(log);

  // Crear jugadores a partir de la lista de nombres de usuario
  if (Array.isArray(strategy.usernames)) {
    for (const username of strategy.usernames) {
      const user = await userController.getUserByUsername(username);
      const player = createPlayer(username, generateStrategyCode(user.blocks, true), log);
      players.push(player);
      if (socketListener) {
        socketListener.on("leaveRoom", (data) => {
          console.log("leaveRoom", data);
          newGame.players = newGame.players.filter(p => p.name !== data.username);
          console.log("newGame.players", newGame.players);
        });
        socketListener.on("disconnect", () => {
          newGame.stop();
        });
      }
    }
  } else {
    if (strategy.random) {
      players = await createPlayers(log, true, strategy.numPlayers, strategy.username);
    } else {
      players = await createPlayers(log, false, strategy.numPlayers, strategy.username);
    }
    const newPlayer = createPlayer(strategy.username, generateStrategyCode(strategy.blocks, true), log);
    console.log("newPlayer", newPlayer);
    players.push(newPlayer);
    if (socket) {
      socket.on("stopGame", () => {
        newGame.stop();
      });
      socket.on("disconnect", () => {
        newGame.stop();
      });
    }
  }

  newGame.setPlayers(players);
  const simulationPromise = simulateGames(newGame.players);
  const mainGameResult = await newGame.main();
  const simResults = await simulationPromise;
  await updatePlayerStats(players, mainGameResult, simResults);
  const results = processResults(mainGameResult, simResults);

  if (socket) {
    socket.emit("simulationResults", { results, averageTurns: simResults.averageTurns });
  }
  return newGame;
};



export { init }