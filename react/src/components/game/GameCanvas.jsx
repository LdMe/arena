import React, { useEffect, useRef, useState } from 'react';
import Game from '../../gameLogic/game';
import { createPlayer, createPlayers } from '../../gameLogic/player';
import { generateStrategyCode } from '../../utils/strategy';
import worker from '../../gameLogic/workerWraper';


const GameCanvas = ({ strategy, log, randomPlayers = false, numPlayers = 5 }) => {
    console.log("strategy", strategy)
    const canvasRef = useRef(null);
    const [players, setPlayers] = useState(createPlayers(log, randomPlayers, numPlayers));
    const [started, setStarted] = useState(false);
    const [currentGame, setCurrentGame] = useState(null);
    useEffect(() => {
        if (!started && players) {
            init();
        }
    }, [players, started]);
    useEffect(() => {
        return () => {
            console.log("cleaning up", currentGame);
            currentGame?.stop();
        }
    }, [currentGame]);
    const init = () => {
        setStarted(true);
        const newPlayers = [...players];
        const newPlayer = createPlayer(strategy.name, generateStrategyCode(strategy.blocks, true), "/sprites/magenta.png", log);
        newPlayers.push(newPlayer);
        simulate(newPlayers);
        const newGame = new Game(newPlayers, canvasRef.current, log);
        setCurrentGame(newGame);
        setPlayers(newPlayers);
        newGame.main(setPlayers);
    }
    const simulate = (players) => {
        console.log("simulating", players);
        
        const playerData = players.map((player) => player.getData());
        console.log("worker", worker);
        worker.postMessage({ playerData, runs: 2 ,canvas:{width:canvasRef.current.width,height:canvasRef.current.height} });
        console.log("Worker should be running");
        worker.onmessage = (e) => {
            console.log("simulation result", e.data);
            // Actualizar el estado o la interfaz con los resultados
        };
    }
    return (
        <article className="game-canvas">
            <canvas ref={canvasRef} width={800} height={600} />

        </article>
    );
};

export default GameCanvas;
