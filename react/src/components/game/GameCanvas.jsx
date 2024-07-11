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
            if(!multiplayer && socket){
                socket.emit("startGame",strategy);
            }
        }
        if(!socket){
            return;
        }
        socket.on("simulationResults", (data) => {
            console.log("simulation results", data)
            gameRef.current.drawWinners(data.results.slice(0,3));
            log("Resultados de simulación: ")
            log("Media de turnos por partida: " + parseInt(data.averageTurns));
            data.results.forEach(player => log(`${player.name}: victorias: ${player.wins}, empates: ${player.draws}, derrotas: ${player.losses}`));
            
        })
        socket.on("log", (data) => {

            if(data.log ===""){
                return
            }
            if(!data.players){
                log(data.log);
                return
            }
            setTime(data.turnsRemaining)
            log(data.log)

            if(!gameRef.current){

                const newGame = new Game(data.players,canvasRef.current,multiplayer);
                gameRef.current = newGame;
                newGame.draw();
            }
            else if(data.players?.length > 0){
                gameRef.current.updatePlayers(data.players);

                gameRef.current.draw();
                gameRef.current.deleteDeadPlayers();
            }
        })
        return () => {

            socket.off("log");
            socket.off("simulationResults");
        }
    }, [strategy,canvasRef.current,started]);
    useEffect(() => {
        return() => {
            if(socket){
                socket.emit("stopGame");
            }
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
