import { useState, useEffect } from "react"
import ArenaStats from "./ArenaStats";

const Room = ({ room, username, handleStartRoom, handleLeaveRoom }) => {
    const [playing, setPlaying] = useState(false);

    const handleStart = ({ speed, fill }) => {
        handleStartRoom({ roomId: room.id, speed, fill });
    }

    if (playing) {

        return (
            <section className="game">
                <GameCanvas strategy={{ username }} multiplayer={true} socket={socket} log={addLog} />
                <Log log={log} />
                <section className="buttons">

                    <button onClick={handleStopPlaying}>Volver</button>
                </section>
            </section>
        )
    }
    return (
        <section className="room">
            <h2>Arena: {room.id}</h2>
            <p>Jugadores: {room.players.length} / {room.maxPlayers}</p>
            <p>Espectadores : {room.spectators?.length}</p>
            <ul>
                {room.players.map(player => (
                    <li key={player.id}>
                        {player.username}
                    </li>
                ))}
            </ul>
            {room.owner === username &&
                <ArenaStats onSubmit={handleStart} disabled={room.players.length < 2} />
            }

            <section className="footer">
                <button onClick={handleLeaveRoom}>Abandonar</button>
            </section>
        </section>
    )


}

export default Room