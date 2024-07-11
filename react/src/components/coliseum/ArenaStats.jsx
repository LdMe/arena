import { useState } from "react"

const ArenaStats = ({ onSubmit, disabled=false }) => {
    const  [speed, setSpeed] = useState(1)
    const  [fill, setFill] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ speed, fill })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="speed">Velocidad de simulación</label>
            <input type="range" min="0.5" max="4" name="speed" id="speed" step="0.5" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            <input type="number" min="0.5" max="4" name="speed" id="speed" step="0.5" value={speed} onChange={(e) => setSpeed(e.target.value)} />
            <label htmlFor="fill">Rellenar con NPCs</label>
            <input type="checkbox" name="fill" id="fill"  checked={fill} onChange={(e) => setFill(e.target.checked)}/>
            <button type="submit" disabled={disabled}>Comenzar</button>
        </form>
    )
}

export default ArenaStats