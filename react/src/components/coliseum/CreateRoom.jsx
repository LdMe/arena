import { useState, useEffect } from "react"
import Modal from "../modal/Modal"
const CreateRoom = ({ onCreate, socket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [room, setRoom] = useState({
        roomId: "",
        isPublic: true,
        role: "player",
        maxPlayers: 4
    });
    const [error, setError] = useState("");
    const handleUpdateRoom = (key, value) => {
        setRoom(prevRoom => ({ ...prevRoom, [key]: value }));
    }
    const handleCreateRoom = () => {
        if(!room.roomId) {
            setError("El nombre de la arena es obligatorio");
            return;
        }
        onCreate(room);
    }
    useEffect(() => {
        socket.on("roomExists", (data) => {

            setError(data.error)
        })
        return () => {
            socket.off("roomExists")
        }
    }, [socket])
    return (
        <>
            <section className="create-room">
                <button onClick={() => setIsOpen(true)}>Nueva arena</button>
            </section>
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <section className="create-room">
                        <h2>Nueva arena</h2>
                        <p className="error">{error}</p>
                        <form className="create-room-form">
                            <label htmlFor="roomId">Nombre de la arena</label>
                            <input
                                type="text"
                                name="roomId"
                                id="roomId"
                                value={room.roomId}
                                onChange={e => handleUpdateRoom("roomId", e.target.value)}
                            />
                            <label htmlFor="maxPlayers">Máximo de jugadores</label>
                            <input
                                type="number"
                                name="maxPlayers"
                                id="maxPlayers"
                                value={room.maxPlayers}
                                onChange={e => handleUpdateRoom("maxPlayers", e.target.value)}
                            />
                            <label htmlFor="isPublic">¿Es pública?</label>
                            <input
                                type="checkbox"
                                name="isPublic"
                                id="isPublic"
                                checked={room.isPublic}
                                onChange={e => handleUpdateRoom("isPublic", e.target.checked)}
                            />
                            <label htmlFor="role">Entrar como</label>
                            <select name="role" id="role" value={room.role} onChange={e => handleUpdateRoom("role", e.target.value)}>
                                <option value="player">Jugador</option>
                                <option value="spectator">Espectador</option>
                            </select>
                            <button type="button" onClick={handleCreateRoom}>Crear arena</button>
                        </form>
                    </section>
                </Modal>
            )}
        </>
    )

}

export default CreateRoom