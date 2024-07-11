import { useState, useEffect } from "react"
import ArenaStats from "./ArenaStats";
import GameCanvas from "../game/GameCanvas";
import Log from "../game/Log";

const Room = ({ roomData, socket,username,  onEnd }) => {
    const [playing, setPlaying] = useState(false);
    const [log, setLog] = useState([]);
    const [room, setRoom] = useState(null);
    useEffect(() => {
        handleJoinRoom(roomData.id,roomData.role);
        socket.on("updateRoom", (data) => {
            console.log("update room", data)
            setRoom(data)
        })
        socket.on("roomFull", (data) => {
            console.log("room full", data)
            onEnd(data.error)
        })
        socket.on("roomNotFound", (data) => {
            console.log("room not found", data)
            onEnd(data.error)
        })
        socket.on("startGame", (data) => {
            setLog([])
            setPlaying(true)
        })
        socket.on("endGame", (data) => {
            console.log("end game", data)
            setRoom(data)
        })
        socket.on("log", (data) => {
            if(!playing){
                setPlaying(true)
            }
        })
        
        return () => {
            socket.off("updateRoom")
            socket.off("startGame")
            socket.off("log")
            socket.off("roomFull")
            socket.off("endGame")
        }
    }, [roomData, socket])
   
    useEffect(() => {
        if (room?.isPlaying) {
            setPlaying(room.isPlaying)
        }
    }, [room])

    const getRole = (username) => {
        if (room) {
            if (room.players.find(player => player.username === username)) {
                return "player"
            } else if (room.spectators.find(spectator => spectator.username === username)) {
                return "spectator"
            }
        }
    }
    const handleLeaveRoom = () => {
        setPlaying(false);
        if (!room) return
        socket.emit("leaveRoom", { roomId: room.id })
        onEnd()
    }
    const handleStopPlaying = () => {
        setPlaying(false);
        setLog([]);
    }
    const handleStartRoom = (data) => {
        socket.emit("startRoom",data)
        setLog([]);
    }
    const handleStart = ({ speed, fill }) => {
        handleStartRoom({ roomId: room.id, speed, fill });
    }
    const handleJoinRoom = (roomId, role = "player") => {
        if(!room){
            socket.emit("joinRoom", { roomId, role })
        }
    }
    const handleChangeRole = () => {
        if(room.isPlaying){
            return
        }
        const role = getRole(username) === "player" ? "spectator" : "player";
        socket.emit("joinRoom", { roomId: room.id, role })
    }
    const addLog = (text) => {
        setLog(prevLog => [...prevLog, text]);
    }
    if(!room) return <p>Cargando...</p>
    if (playing) {

        return (
            <section className="game">
                <GameCanvas strategy={{ username }} multiplayer={true} socket={socket} log={addLog} />
                <Log log={log}/>
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
            {room.owner === username && ! room.isPlaying &&
                <ArenaStats onSubmit={handleStart} disabled={room.players.length < 2} />
            }
            {room.isPlaying ? <button onClick={()=>setPlaying(true)}>Ver partida</button> : <p>Esperando jugadores...</p>}
            {!room.isPlaying && <button onClick={handleChangeRole}>{getRole(username) === "player" ? "Entrar como espectador" : "Entrar como jugador"}</button>}
            <section className="footer">
                <button onClick={handleLeaveRoom}>Abandonar</button>
            </section>
        </section>
    )


}

export default Room