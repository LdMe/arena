

const Room = ({ room, username, handleStartRoom, handleLeaveRoom }) => {

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