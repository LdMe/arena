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
    const [gameEnded, setGameEnded] = useState(false);


    useEffect(() => {
        socket.on("endGame", () => {
            setGameEnded(true);
        })

        return () => {
            socket.off("endGame");
        }

    }, [])
    const addLog = (text) => {
        if (text === log[log.length - 1]) return
        setLog(prevLog => [...prevLog, text]);
    };
    const handleDifficulty = (e) => {
        setDifficulty(e.target.value)
    }
    const handleStartGame = () => {

        setGameEnded(false);
        setLog([]);
        setSpeed(speed =>handleSpeed(speed))
        setNumPlayers(numPlayers =>handleNumPlayers(numPlayers))
        setPlaying(true);
    }
    const handleStopGame = () => {
        if(gameEnded) return
        socket.emit("stopGame");
        setGameEnded(true);

    }
    const handleExitBattle = () => {
        handleStopGame();
        setPlaying(false);
    }
    const handleSpeed = (speed) => {
        return Math.max(Math.min(speed, 4), 0.5)
    }
    const handleNumPlayers = (numPlayers) => {
        return Math.max(Math.min(numPlayers, 9), 1)
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
                            <option value="medium">Gladiator (medio)</option>
                            <option value="hard">Imperator (difícil)</option>
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
                        <label htmlFor="speed">Velocidad de simulación</label>
                        <input
                            type="range"
                            name="speed"
                            id="speed"
                            value={speed}
                            onChange={e => setSpeed(e.target.value)}
                            min="0.5"
                            max="4"
                            step="0.5"
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
            <GameCanvas strategy={{ username: userData.username, blocks, difficulty: difficulty, numPlayers, speed }} socket={socket} log={addLog} />
            <Log log={log} />
            <section className="buttons">
                { gameEnded?
                <button onClick={handleExitBattle}>Volver</button>
                :
                <button onClick={handleStopGame}>Finalizar simulación</button>
                }
            </section>
        </section>
    )
}

export default Game