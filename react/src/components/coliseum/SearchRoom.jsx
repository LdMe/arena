import { useEffect, useState } from "react"
import Modal from "../modal/Modal"

const SearchRoom = ({ onJoin, socket }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [role, setRole] = useState("player");
    const [error, setError] = useState("");
    const handleSelectRoom = (roomId) => {
        onJoin(roomId, role);
    }
    useEffect(() => {
        socket.on("roomNotFound", (data) => {
            console.log("roomNotFound", data)
            setError(data.error)
        })
        return () => {
            socket.off("roomNotFound")
        }
    }, [socket])
    return (
        <section className="search-room">
            {isOpen &&
                <Modal onClose={() => setIsOpen(false)}>
                    <section className="search-room">
                        <h2>Buscar arena</h2>
                        <p className="error">{error}</p>
                        <form className="search-room-form">
                            <label htmlFor="roomId">Nombre de la arena</label>
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
            }
            <button onClick={() => setIsOpen(true)}>Buscar arena</button>

        </section>
    )

}

export default SearchRoom