import React, { useEffect, useRef, useState } from 'react';
import Game from '../../gameLogic/game';

const GameCanvas = ({ strategy,socket,log,multiplayer=false}) => {
    console.log("strategy", strategy)
    const canvasRef = useRef(null);
    const [game, setGame] = useState(null);
    const [started, setStarted] = useState(false);
    const [time,setTime] = useState(0);
    
    useEffect(() => {
        if(!canvasRef.current){
            return;
        }
        if(!started){
            setStarted(true);
            if(!multiplayer){
                socket.emit("startGame",strategy);
            }
        }
        console.log("refreshing")
        socket.on("simulationResults", (data) => {
            console.log("simulationResults",data)
            log("Resultados de simulación: ")
            log("Media de turnos por partida: " + parseInt(data.averageTurns));
            const players = data.results.forEach(player => log(`${player.name}: victorias: ${player.wins}, empates: ${player.draws}, derrotas: ${player.losses}`));
            
        })
        socket.on("log", (data) => {
            console.log("log",data)
            if(data.log ===""){
                return
            }
            setTime(data.turnsRemaining)
            log(data.log)
            if(!game){
                const newGame = new Game(data.players,canvasRef.current);
                setGame(newGame);
                newGame.draw();
            }
            else{
                game.updatePlayers(data.players);
                game.draw();
                game.deleteDeadPlayers();
            }
        })
        return () => {
            socket.off("log");
            socket.off("simulationResults");
        }
    }, [strategy,canvasRef.current,started]);
    useEffect(() => {
        return() => {
            socket.emit("stopGame");
        }
    },[])
    
    
    return (
        <article className="game-canvas">
            <canvas ref={canvasRef} width={800} height={600} />
            <p>Tiempo restante: {time} s</p>
        </article>
    );
};

export default GameCanvas;
