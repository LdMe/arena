import Condition from "./Condition";
import Action from "./Action";
import { createDefaultCondition, updateCondition } from "../utils/condition";
function Block({ block, updateBlock, deleteBlock, moveBlock, resetBlock, index, maxIndex }) {
    const addCondition = () => {
        const newCondition = createDefaultCondition('comparison');
        updateBlock(block.id, {
            conditions: [...block.conditions, newCondition]
        });
    };


    const handleUpdateCondition = (condition,updates) => {
        const newConditions = block.conditions.map(c => {
            if (c.id === condition.id) {
                return updateCondition(c, updates);
            }
            return c;
        });
        updateBlock(block.id, { conditions: newConditions });
    }
   
    const handleUpdateAction = (updates) => {
        const newAction = { ...block.action, ...updates };
        if (updates.type === 'attack') {
            newAction.target = 'maxHp';
        }
        updateBlock(block.id, { action: newAction });
    }
    return (
        <div className="block" style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <h3>Bloque de Reglas</h3>
            <div className="conditions">
                {block.conditions.map(condition => (
                    <Condition
                        key={condition.id}
                        condition={condition}
                        updateCondition={(updates) => handleUpdateCondition(condition, updates)}
                    />
                ))}
                <button onClick={addCondition}>Añadir Condición</button>
            </div>
            <div className="actions">

                <Action
                    key={block.action.id}
                    action={block.action}
                    updateAction={handleUpdateAction}
                />

            </div>
            {index > 0 && <button onClick={() => moveBlock(block.id, "up")}>Subir Bloque</button>}
            {index < maxIndex && <button onClick={() => moveBlock(block.id, "down")}>Bajar Bloque</button>}
            <button onClick={() => resetBlock(block.id)}>Limpiar Bloque</button>
            <button onClick={() => deleteBlock(block.id)}>Eliminar Bloque</button>

        </div>
    );
}

export default Block