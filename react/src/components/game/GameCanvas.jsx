import React, { useEffect, useRef, useState } from 'react';
import Game from '../../gameLogic/game';

const GameCanvas = ({ strategy,socket,log,multiplayer=false}) => {
    const canvasRef = useRef(null);
    const gameRef = useRef(null);
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
            data.results.forEach(player => log(`${player.name}: victorias: ${player.wins}, empates: ${player.draws}, derrotas: ${player.losses}`));
            
        })
        socket.on("log", (data) => {
            console.log("log",data)
            if(data.log ===""){
                return
            }
            if(!data.players){
                log(data.log);
                return
            }
            setTime(data.turnsRemaining)
            log(data.log)
            console.log("game",gameRef.current)
            if(!gameRef.current){
                console.log("new game",data)
                const newGame = new Game(data.players,canvasRef.current,multiplayer);
                gameRef.current = newGame;
                newGame.draw();
            }
            else if(data.players?.length > 0){
                gameRef.current.updatePlayers(data.players);
                console.log("drawing")
                gameRef.current.draw();
                gameRef.current.deleteDeadPlayers();
            }
        })
        return () => {
            console.log("cleaning up canvas")
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
            <b>{strategy.username}</b>
            <p>Jugadas restantes: {time}</p>
        </article>
    );
};

export default GameCanvas;
