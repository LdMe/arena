import { useState, useEffect } from "react"
import Modal from "../modal/Modal"
const CreateRoom = ({ onCreate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [room, setRoom] = useState({
        roomId: "",
        isPublic: true,
        maxPlayers: 4
    });
    const handleUpdateRoom = (key, value) => {
        setRoom(prevRoom => ({ ...prevRoom, [key]: value }));
    }
    const handleCreateRoom = () => {
        setIsOpen(false);
        onCreate(room);
    }
    
    if (isOpen) {
        return (
            <Modal onClose={() => setIsOpen(false)}>
                <section className="create-room">
                    <form className="create-room-form">
                    <label htmlFor="roomId">Nombre de la sala</label>
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
                    <button type="button" onClick={handleCreateRoom}>Crear sala</button>
                    </form>
                </section>
            </Modal>
        )
    }
    return (
        <section className="create-room">
            <button onClick={() => setIsOpen(true)}>Nueva sala</button>
        </section>
    )

}

export default CreateRoom