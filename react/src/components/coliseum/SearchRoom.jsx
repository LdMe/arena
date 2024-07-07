import { useState } from "react"
import Modal from "../modal/Modal"

const SearchRoom = ({onJoin}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [role, setRole] = useState("player");
    const [error, setError] = useState("");
    const handleSelectRoom = (roomId) => {
        onJoin(roomId, role);
    }
    return (
        <section className="search-room">
            {isOpen ?
            <Modal onClose={() => setIsOpen(false)}>
                <section className="search-room">
                    <form className="search-room-form">
                        <label htmlFor="roomId">Nombre de la sala</label>
                        <input
                            type="text"
                            name="roomId"
                            id="roomId"
                            value={roomId}
                            onChange={e => setRoomId(e.target.value)}
                        />
                        <label htmlFor="role">Entrar como</label>
                        <select name="role" id="role" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="player">Jugador</option>
                            <option value="spectator">Espectador</option>
                        </select>
                        <button type="button" onClick={() => handleSelectRoom(roomId)}>Buscar</button>
                    </form>
                </section>
            </Modal>
            :
            <button onClick={() => setIsOpen(true)}>Buscar sala</button>
            }
        </section>
    )

}

export default SearchRoom