function Action({ action, updateAction }) {
    return (
        <div className="action" style={{ margin: '5px', padding: '5px', border: '1px solid lightgray' }}>
            <h3>Acción</h3>
            <select
                value={action.type}
                onChange={e => updateAction({ type: e.target.value })}
            >
                <option value="attack">Atacar</option>
                <option value="defend">Defender</option>
                <option value="rest">Descansar</option>
            </select>
            {action.type === "attack" &&
                <select
                    value={action.target || 'maxHp'}
                    onChange={e => updateAction({ target: e.target.value })}
                >
                    <option value="maxHp">Gladiador con más vida</option>
                    <option value="minHp">Gladiador con menos vida</option>
                    <option value="maxEnergy">Gladiador con más energía</option>
                    <option value="minEnergy">Gladiador con menos energía</option>
                    <option value="random">Gladiador aleatorio</option>
                </select>
            }
        </div>
    );
}
export default Action