import React, { useEffect, useRef, useState } from 'react';
import Game from '../../gameLogic/game';

const GameCanvas = ({ strategy,socket,log}) => {
    console.log("strategy", strategy)
    const canvasRef = useRef(null);
    const [game, setGame] = useState(null);
    const [started, setStarted] = useState(false);
    
    useEffect(() => {
        if(!canvasRef.current){
            return;
        }
        if(!started){
            setStarted(true);
            socket.emit("startGame",strategy);
        }
        console.log("refreshing")
        socket.on("log", (data) => {
            console.log("log", data)
            log(data.log)
            if(!game){
                const newGame = new Game(data.players,canvasRef.current);
                setGame(newGame);
                newGame.draw();
            }
            else{
                game.updatePlayers(data.players);
                console.log("updating players", data.players)
                game.draw();
            }
        })
        return () => {
            socket.off("log");
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

        </article>
    );
};

export default GameCanvas;
