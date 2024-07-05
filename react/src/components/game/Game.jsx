import { useState,useEffect } from "react"
import GameCanvas from "./GameCanvas"
import Log from "./Log"

import socket from '../../utils/socket';
import SocketContext from '../../context/socketContext';

const Game = ({ blocks, userData, onEnd }) => {
    const [log, setLog] = useState([]);
    const [hasRandomPlayers, setHasRandomPlayers] = useState(true);
    const [numPlayers, setNumPlayers] = useState(5);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        socket.connect();
        socket.emit("login", { username: userData.username });
    },[userData])
    const addLog = (text) => {
        setLog(prevLog => [...prevLog, text]);
    };
    const handlePlayerTypes = (e) => {
        setHasRandomPlayers(e.target.value === "random")
    }
    const handleResetGame = () => {
        console.log("reset")
        setPlaying(false);
    }
    const handleStartGame = () => {
        console.log("log", log)
        setLog([]);
        setPlaying(true);
    }
    if (!playing) {
        return (
            <section className="game-options">
                <form>
                    <label htmlFor="playerTypes">Enemigos</label>
                    <select name="playerTypes" id="playerTypes" onChange={handlePlayerTypes}>
                        <option value="random">Aleatorio</option>
                        <option value="manual">Mejores</option>
                    </select>
                    {hasRandomPlayers && (
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
                    )}
                </form>
                <button onClick={handleStartGame}>Comenzar</button>
            </section>
        )
    }
    return (
        <section className="game">
            <GameCanvas log={addLog} strategy={{ name: userData.username, blocks }} randomPlayers={hasRandomPlayers} numPlayers={numPlayers} />
            <Log log={log} />
            <section className="buttons">

                <button onClick={handleResetGame}>Reiniciar partida</button>
                <button onClick={() => onEnd("builder")}>Repensar la estrategia</button>
            </section>
        </section>
    )
}

export default Game