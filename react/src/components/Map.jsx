

const Map = ({onEnd})=>{

    return (
        <div>
            <h1>Mapa</h1>
                <button onClick={()=>onEnd("builder")}>Estrategia</button>
                <button onClick={()=>onEnd("game")}>Entrenar</button>
        </div>
    )
}

export default Map