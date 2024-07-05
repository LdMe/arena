import Condition from "./Condition";
import Action from "./Action";
import { createDefaultCondition } from "../utils/condition";
function Block({ block, updateBlock, deleteBlock,moveBlock,resetBlock, index,maxIndex }) {
    const addCondition = () => {
        const newCondition = createDefaultCondition('comparison');
        updateBlock(block.id, {
            conditions: [...block.conditions, newCondition]
        });
    };

    const addAction = () => {
        const newAction = { id: Date.now(), type: 'attack' };
        updateBlock(block.id, {
            action:  newAction
        });
    };

    const handleUpdateCondition = (condition,updates) => {
        const newConditions = block.conditions.map(c => {
            if (c.id === condition.id) {
                console.log("updates",updates)
                if(updates.value ===""){
                    updates.value = 0;
                }
                if(updates.value && updates.value !== "true" && updates.value !== "false"){
                    updates.value = parseInt(updates.value);
                    if(isNaN(updates.value) || updates.value < 0){
                        updates.value = 0;
                    }
                    if(updates.value > 100){
                        updates.value = 100;
                    }
                }
                if (updates.type === 'composite') {

                    // Si estamos cambiando a una condición anidada, inicializamos las subcondiciones
                    return {
                        ...c,
                        ...updates,
                        logic: 'and',
                        leftCondition: createDefaultCondition('comparison',condition.level+1),
                        rightCondition: createDefaultCondition('comparison',condition.level+1),
                    };
                }
                if(updates.attribute === 'isDefending'){
                    updates.operator = "eq";
                    updates.value="true"
                }
                else if(condition.attribute !=='isDefending'){
                    if(isNaN(updates.value)){
                        updates.value = 50;
                    }
                }
                if(updates.type === 'comparison'){
                    updates.target = 'self';
                    updates.attribute = 'health';
                    updates.operator = 'gt';
                }
                return { ...condition, ...updates };
            }
            return c;
        });
        updateBlock(block.id, { conditions: newConditions });
    }
    const handleUpdateAction = (updates) => {
        const newAction = { ...block.action, ...updates };
        if(updates.type === 'attack'){
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
                        updateCondition={(updates) => handleUpdateCondition(condition,updates)}
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
            {index > 0 && <button onClick={() => moveBlock(block.id,"up")}>Subir Bloque</button>}
            {index < maxIndex && <button onClick={() => moveBlock(block.id,"down")}>Bajar Bloque</button>}
            <button onClick={() => resetBlock(block.id)}>Limpiar Bloque</button>
            <button onClick={() => deleteBlock(block.id)}>Eliminar Bloque</button>

        </div>
    );
}

export default Block