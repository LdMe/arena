import { useState, useEffect } from "react"
import GameCanvas from "../game/GameCanvas";
import Log from "../game/Log";
import CreateRoom from "./CreateRoom";
import SearchRoom from "./SearchRoom";
import Room from "./Room";
import './Coliseum.css';

const Coliseum = ({ onEnd, socket, username }) => {
    const [publicRooms, setPublicRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [log, setLog] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        socket.emit("getRooms")
        socket.on("updateRooms", (data) => {
            console.log("updateRooms", data)
            setPublicRooms(data.publicRooms)
        })
        socket.on("updateRoom", (data) => {
            console.log("updateRoom", data)
            setCurrentRoom(data)
            if(data.isPlaying) setPlaying(true)
        })
        socket.on("startGame", (data) => {
            console.log("startGame", data)
            setPlaying(true)
        })
        socket.on("log", (data) => {
            if(!playing){
                setPlaying(true)
            }
        })
        socket.on("roomFull", (data) => {
            setError(data.error)
        })
        return () => {
            socket.off("updateRooms")
            socket.off("updateRoom")
            socket.off("startGame")
            socket.off("log")
            socket.off("roomFull")
        }
    }, [socket])
    useEffect(() => {
        socket.on("deleteRoom", (data) => {
            console.log("deleteRoom", data)
            setCurrentRoom(null)
        })
        return () => {
            socket.off("deleteRoom")
        }
    },[currentRoom])
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
    const handleStartRoom = (data) => {
        console.log("startRoom")
        socket.emit("startRoom",data)
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
                
            </div>
        )
    }
    return (
        <div className="coliseum">
            <h1>Coliseo</h1>
            <section className="buttons">
                <CreateRoom onCreate={handleCreateRoom}  socket={socket}/>
                <SearchRoom onJoin={handleJoinRoom} socket={socket} />
            </section>
            <section className="public-rooms">
                <h2>Arenas públicas</h2>

                <p className="error">{error}</p>
                <ul>
                    {publicRooms.map(room => (
                        <li key={room.id}>
                            <h3>{room.id}</h3>
                            <p>Jugadores: <span className={ room.players.length >= room.maxPlayers ? "error" : ""}>{room.players.length} / {room.maxPlayers}</span></p>
                            <p>Espectadores : {room.spectators?.length}</p>
                            <p>Estado : {room.isPlaying ? "En juego" : "Esperando jugadores"}</p>
                            <button disabled={room.players.length >= room.maxPlayers} onClick={() => handleJoinRoom(room.id, "player")}>
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