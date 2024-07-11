import { useState, useEffect } from "react"
import { getTopScores } from "../../utils/fetch";
import WinnerCanvas from "../game/WinnerCanvas";
import '../game/Game.css';
import './Scores.css';
const Scores = ({onEnd}) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        handlegetTopScores()
    }, [])
    const handlegetTopScores = async () => {
        try {
            const result = await getTopScores();
            if (result && !result.error) {
                const winners = result.map((score) => ({ name: score.username, wins: score.wins, draws: score.draws, losses: score.losses }))
                setScores(winners)
                setLoading(false)
            }
        }
        catch (e) {
            console.error(e);
            setError(e)
            setLoading(false)
        }
    }
    
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <div className="game">
        <WinnerCanvas strategy={scores}/>
            <article className="scores">
                <h2>Top 10</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Nombre</th>
                            <th>Victorias</th>
                            <th>Empates</th>
                            <th>Derrotas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{score.name}</td>
                                <td>{score.wins}</td>
                                <td>{score.draws}</td>
                                <td>{score.losses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
            <section className="footer">
                <button onClick={() => onEnd("menu")}>Volver</button>
            </section>
        </div>
    )
}

export default Scores