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

            setPublicRooms(data.publicRooms)
        })
        socket.on("updateRoom", (data) => {

            setCurrentRoom(data)
            if(data.isPlaying) setPlaying(true)
        })
        socket.on("startGame", (data) => {

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
    const updateCurrentRoom = (data) => {
        setCurrentRoom(data)
    }
    const handleCreateRoom = (room) => {
        console.log("create room", room)
        socket.emit("createRoom", room)
        
        updateCurrentRoom({id: room.roomId, role: room.role})
    }
    const handleLeaveRoom = (error) => {
        if(error) {
            setError(error)
        }
        
        setCurrentRoom(null)
    }
    
    const handleJoinRoom = (roomId, role = "player") => {
        
        setCurrentRoom({ id:roomId, role })
        //socket.emit("joinRoom", { roomId, role })
    }
    const handleStopPlaying = () => {
        setPlaying(false);
    }
    const handleGoBack = () => {
        handleLeaveRoom();
        onEnd("menu");
    }
   
    if (currentRoom) {
        return (
            <div className="coliseum">
                <Room roomData={currentRoom} socket={socket} username={username} onEnd={handleLeaveRoom} /> 
            </div>
        )
    }
    return (
        <div className="coliseum">
            <header>
                <h1>Coliseo</h1>
            <section className="buttons">
                <CreateRoom onCreate={handleCreateRoom}  socket={socket}/>
                <SearchRoom onJoin={handleJoinRoom} socket={socket} />
            </section>
        </header>
        <main>
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
                            <button disabled={room.isPlaying || room.players.length >= room.maxPlayers} onClick={() => handleJoinRoom(room.id, "player")}>
                                Unirse
                            </button>
                            <button onClick={() => handleJoinRoom(room.id, "spectator")}>
                                Espectar
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
            <footer className='footer'>
                <button onClick={handleGoBack}>Volver</button>
            </footer>
        </div>
    )
}

export default Coliseum