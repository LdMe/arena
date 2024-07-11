import React, { useEffect, useRef, useState } from 'react';
import Game from '../../gameLogic/game';

const WinnerCanvas = ({ strategy}) => {
    const canvasRef = useRef(null);
    useEffect(() => {
            console.log("strategy results",strategy)
            handleShowWinners()
    },[strategy])
    
    const handleShowWinners = async() => {
        const newGame = new Game(strategy,canvasRef.current,true);
        await newGame.loadedPromise;
        newGame.drawWinners(strategy.slice(0,3));
    }

    
    return (
        <article className="game-canvas">
            <canvas ref={canvasRef} width={800} height={600} />
        </article>
    );
};

export default WinnerCanvas;
