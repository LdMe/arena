import { useState, useEffect } from "react"
import GameCanvas from "./GameCanvas"
import Log from "./Log"
import './Game.css';

const Game = ({ blocks, userData, onEnd, socket }) => {
    const [log, setLog] = useState([]);
    const [difficulty, setDifficulty] = useState(true);
    const [numPlayers, setNumPlayers] = useState(5);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [game, setGame] = useState(null);


    const start = () => {
        socket.emit("startGame", { username: userData.username, blocks: userData.blocks,speed});
    }
    const addLog = (text) => {
        if (text === log[log.length - 1]) return
        setLog(prevLog => [...prevLog, text]);
    };
    const handleDifficulty = (e) => {
        setDifficulty(e.target.value)
    }
    const handleStartGame = () => {
        console.log("log", log)
        setLog([]);
        setPlaying(true);
    }
    const handleStopGame = () => {
        socket.emit("stopGame");
        
    }
    const handleExitBattle = () => {
        handleStopGame();
        setPlaying(false);
    }
    if (!playing) {
        return (
            <section className="game-options">
                <section className="game-options-section">
                    <h2>Entrenamiento</h2>
                    <form className="game-options-form">
                        <label htmlFor="playerTypes">Dificultad</label>
                        <select name="playerTypes" id="playerTypes" value={difficulty} onChange={handleDifficulty}>
                            <option value="random">Novicius (fácil)</option>
                            <option value="medium">Gladiator (médio)</option>
                            <option value="hard">Imperator (dificil)</option>
                        </select>
                        
                            <>
                                <label htmlFor="numPlayers">Número de enemigos</label>
                                <input
                                    type="range"
                                    name="numPlayers"
                                    id="numPlayers"
                                    value={numPlayers}
                                    onChange={e => setNumPlayers(e.target.value)}
                                    min="1"
                                    max="9"
                                    step="1"
                                />
                                <input type="number" name="numPlayers" id="numPlayers" min="1" max="9" step="1" value={numPlayers} onChange={e => setNumPlayers(e.target.value)} />
                            </>
                            <label htmlFor="speed">Velocidad</label>
                            <input
                                type="range"
                                name="speed"
                                id="speed"
                                value={speed}
                                onChange={e => setSpeed(e.target.value)}
                                min="0.5"
                                max="4"
                                step="0.25"
                            />
                            <input type="number" name="speed" id="speed" min="0.5" max="4" step="0.25" value={speed} onChange={e => setSpeed(e.target.value)} />
                    </form>

                </section>
                <footer className="footer">
                    <button onClick={handleStartGame}>Comenzar</button>
                    <button onClick={() => onEnd("menu")}>Volver</button>
                </footer>

            </section>
        )
    }
    return (
        <section className="game">
            <GameCanvas strategy={{ username: userData.username, blocks, difficulty: difficulty, numPlayers, speed}} socket={socket} log={addLog} />
            <Log log={log} />
            <section className="buttons">
                {}
                <button onClick={handleStopGame}>Finalizar simulación</button>
                <button onClick={handleExitBattle}>Volver</button>
            </section>
        </section>
    )
}

export default Game