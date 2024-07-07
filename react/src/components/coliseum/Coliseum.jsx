import { useState, useEffect } from "react"
import GameCanvas from "../game/GameCanvas";
import Log from "../game/Log";
import CreateRoom from "./CreateRoom";
import SearchRoom from "./SearchRoom";
import Room from "./Room";

import './Coliseum.css';

const Coliseum = ({ onEnd, socket, username }) => {
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
    useEffect(() => {
        return () => {
            socket.emit("leaveRoom", { roomId: currentRoom?.id })
        }
    }, [])
    const addLog = (text) => {
        setLog(prevLog => [...prevLog, text]);
    }
    const handleCreateRoom = (room) => {
        console.log("createRoom", room)
        socket.emit("createRoom", room)
    }
    const handleLeaveRoom = () => {
        setPlaying(false);
        console.log("handleLeaveRoom", currentRoom)
        if (!currentRoom) return
        socket.emit("leaveRoom", { roomId: currentRoom.id })
        setCurrentRoom(null);
    }
    const handleStartRoom = () => {
        console.log("startRoom")
        socket.emit("startRoom", { roomId: currentRoom.id, speed: 1 })
    }
    const handleJoinRoom = (roomId, role = "player") => {
        socket.emit("joinRoom", { roomId, role })
    }
    const handleStopPlaying = () => {
        setPlaying(false);
    }
    const handleGoBack = () => {
        handleLeaveRoom();
        onEnd("menu");
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
    if (currentRoom) {
        return (
            <div className="coliseum">
                <h1>Coliseo</h1>
                <Room room={currentRoom} username={username} handleStartRoom={handleStartRoom} handleLeaveRoom={handleLeaveRoom} />
                <section className='footer'>
                    <button onClick={handleGoBack}>Volver</button>
                </section>
            </div>
        )
    }
    return (
        <div className="coliseum">
            <h1>Coliseo</h1>
            <section className="buttons">
                <CreateRoom onCreate={handleCreateRoom} />
                <SearchRoom onJoin={handleJoinRoom} socket={socket} />
            </section>
            <section className="public-rooms">
                <h2>Arenas públicas</h2>
                <ul>
                    {publicRooms.map(room => (
                        <li key={room.id}>
                            <h3>{room.id}</h3>
                            <p>Jugadores: {room.players.length} / {room.maxPlayers}</p>
                            <p>Espectadores : {room.spectators?.length}</p>
                            <button onClick={() => handleJoinRoom(room.id, "player")}>
                                Unirse
                            </button>
                            <button onClick={() => handleJoinRoom(room.id, "spectator")}>
                                Espectar
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section className='footer'>
                <button onClick={handleGoBack}>Volver</button>
            </section>
        </div>
    )
}

export default Coliseum