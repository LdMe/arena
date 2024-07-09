
import './Menu.css';
const Menu = ({ onEnd }) => {

    return (
        <div className="menu-container">
            <h1>Menú</h1>
            <section className="menu-grid">
                <article className="menu-card" onClick={() => onEnd("intro")}>
                    <img src="/sprites/intro.png" alt="intro" />
                    <h2>Introducción</h2>
                </article>
                <article className="menu-card" onClick={() => onEnd("builder")}>
                    <img src="/sprites/strategy.png" alt="strategy" />
                    <h2>Estrategia</h2>
                </article>
                <article className="menu-card" onClick={() => onEnd("game")}>
                    <img src="/sprites/train.png" alt="train" />
                    <h2>Entrenamiento</h2>
                </article>
                <article className="menu-card" onClick={() => onEnd("coliseum")}>
                    <img src="/sprites/coliseum.png" alt="coliseum" />
                    <h2>Coliseo</h2>
                </article>
            </section>
        </div>
    )
}

export default Menu