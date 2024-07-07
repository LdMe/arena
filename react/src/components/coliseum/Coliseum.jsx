import { useState, useEffect } from "react"
import GameCanvas from "../game/GameCanvas";
import Log from "../game/Log";
const Coliseum = ({onEnd,socket,username}) => {
    const [roomName, setRoomName] = useState("");
    const [publicRooms, setPublicRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [log, setLog] = useState([]);

    useEffect(() => {
        socket.emit("getRooms")
        socket.on("updateRooms", (data) => {
            console.log("updateRooms", data)
            setPublicRooms(data.publicRooms)
        })
        socket.on("updateRoom", (data) => {
            console.log("updateRoom", data)
            setCurrentRoom(data)
        })
        socket.on("startGame", (data) => {
            console.log("startGame", data)
            setPlaying(true)
        })
        return () => {
            socket.off("updateRooms")
            socket.off("updateRoom")
        }
    }, [socket])
    const addLog = (text) => {
        setLog(prevLog => [...prevLog, text]);
    }
    const handleCreateRoom = () => {
        socket.emit("createRoom", { roomId: roomName, isPublic: true })
    }
    const handleLeaveRoom = () => {
        setPlaying(false);
        if(!currentRoom) return
        socket.emit("leaveRoom", { roomId: currentRoom.id })
        setCurrentRoom(null);
    }
    const handleStartRoom = () => {
        console.log("startRoom")
        socket.emit("startRoom", { roomId: currentRoom.id })
    }
    if(playing){
        return(
            <section className="game">
            <GameCanvas multiplayer={true} socket={socket} log={addLog} />
            <Log log={log} />
            <section className="buttons">

                <button onClick={handleLeaveRoom}>Volver</button>
            </section>
        </section>
        )
    }
    if(currentRoom){
        return (
            
            <div>
                <h1>Coliseo</h1>
                <section className="room">
                    <h2>Sala: {currentRoom.id}</h2>
                    <ul>
                        {currentRoom.players.map(player => (
                            <li key={player.id}>
                                {player.username}
                            </li>
                        ))}
                    </ul>
                    {currentRoom.owner === username && <button onClick={handleStartRoom}>Comenzar partida</button>}
                    <button onClick={handleLeaveRoom}>Abandonar</button>
                </section>
                <section className='footer'>
                    <button onClick={() => onEnd("menu")}>Volver</button>
                </section>
            </div>
        )
    }
    return (
        <div>
            <h1>Coliseo</h1>
            <section className="create-room">
                <label htmlFor="roomName">Nombre de la sala</label>
                <input
                    type="text"
                    name="roomName"
                    id="roomName"
                    value={roomName}
                    onChange={e => setRoomName(e.target.value)}
                />
                <button onClick={handleCreateRoom}>Crear sala</button>
            </section>
            <section className="public-rooms">
                <h2>Salas publicas</h2>
                <ul>
                    {publicRooms.map(room => (
                        <li key={room.id}>
                            <button onClick={() => socket.emit("joinRoom", { roomId: room.id, role:"player" })}>
                                {room.id}
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className='footer'>
                <button onClick={() => onEnd("menu")}>Volver</button>
            </section>
        </div>
    )
}

export default Coliseum