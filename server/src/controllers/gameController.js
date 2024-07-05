import Game from "../gameLogic/game.js";
import { createPlayers, createPlayer } from "../gameLogic/player.js";
import { generateStrategyCode } from "../utils/strategy.js";


const init = (strategy,socket=null) => {
    console.log("strategy", strategy)
    let players = [];
    let log =  (...args) =>console.log(...args);
    if(socket){
        log = (...args) => {
            socket.emit("log",{log:[...args],players})
        };
    }
    if(strategy.random){
       players =  createPlayers(log, true, strategy.numPlayers);
    }
    else{
        players = createPlayers(log);
    }
    const newPlayer = createPlayer(strategy.username, generateStrategyCode(strategy.blocks, true), log);
    players.push(newPlayer);
    const newGame = new Game(players,  log);
    players = newGame.players;
    if(socket){
        socket.on("stopGame", () => {
            newGame.stop();
        })
        socket.on("disconnect", () => {
            newGame.stop();
        })
    }
    const data = newGame.main((newPlayers )=> {
        // players = newPlayers;
        // log("new players")
    });
    console.log("data",data)
    return newGame;
}


export { init }