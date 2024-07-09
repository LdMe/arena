import { useState, useEffect } from "react"

const Room = ({ room, username, handleStartRoom, handleLeaveRoom }) => {
    const [playing, setPlaying] = useState(false);

    if(playing){

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
            {room.owner === username && <button onClick={handleStartRoom}>Comenzar partida</button>}
            <button onClick={handleLeaveRoom}>Abandonar</button>
        </section>
    )


}

export default Room