import { useState, useEffect } from "react"
import GameCanvas from "./GameCanvas"
import Log from "./Log"
import './Game.css';
import socket from '../../utils/socket';
import SocketContext from '../../context/socketContext';

const Game = ({ blocks, userData, onEnd }) => {
    const [log, setLog] = useState([]);
    const [hasRandomPlayers, setHasRandomPlayers] = useState(true);
    const [numPlayers, setNumPlayers] = useState(5);
    const [playing, setPlaying] = useState(false);
    const [game, setGame] = useState(null);

    useEffect(() => {
        socket.connect();
        socket.emit("login", { username: userData.username });
        /* socket.emit("startGame", { username: userData.username, blocks: blocks });
        socket.on("log", (data) => {
            console.log("log", data)
        }) */
        return () => {
            socket.disconnect();
        }
    }, [userData])

    const start =() =>{
        socket.emit("startGame", { username: strategy.username, blocks: strategy.blocks });
        socket.on("log", (data) => {
            console.log("log", data)
            log(data.log)
            if(!game){
                const newGame = new Game(data.players,canvasRef.current);
                setGame(newGame);
            }
            else{
                game.updatePlayers(data.players);
                console.log("updating players", data.players)
                game.draw();
            }
        })
    }
    const addLog = (text) => {
        if(text === log[log.length-1]) return
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
            <GameCanvas  strategy={{ username: userData.username, blocks }} socket={socket} log={addLog} />
            <Log log={log} />
            <section className="buttons">

                <button onClick={handleResetGame}>Reiniciar partida</button>
                <button onClick={() => onEnd("builder")}>Repensar la estrategia</button>
            </section>
        </section>
    )
}

export default Game