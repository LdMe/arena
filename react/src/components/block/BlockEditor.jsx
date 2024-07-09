import { useState } from "react";
import Condition from "../Condition"
import Action from "../Action"
import { createDefaultCondition, updateCondition, createDefaultBlock } from "../../utils/condition";
import { FaTrash } from "react-icons/fa";

const BlockEditor = ({ block, onUpdate, onCancel }) => {
    const [newBlock, setNewBlock] = useState(block);

    const handleSave = () => {
        onUpdate(newBlock);
    }
    const handleUpdateCondition = (condition, updates) => {
        const newConditions = newBlock.conditions.map(c => {
            if (c.id === condition.id) {
                return updateCondition(c, updates);
            }
            return c;
        });

        setNewBlock({ ...newBlock, conditions: newConditions });
    }

    const handleUpdateAction = (updates) => {
        const newAction = { ...newBlock.action, ...updates };
        if (updates.type === 'attack') {
            newAction.target = 'maxHp';
        }
        setNewBlock({ ...newBlock, action: newAction });
    }
    const addCondition = () => {
        const newCondition = createDefaultCondition('comparison');
        setNewBlock({ ...newBlock, conditions: [...newBlock.conditions, newCondition] });
    };
    const handleReset = () => {
        setNewBlock(createDefaultBlock());
    };
    const handleDeleteCondition = (conditionId) => {
        const newConditions = newBlock.conditions.filter(c => c.id !== conditionId);
        setNewBlock({ ...newBlock, conditions: newConditions });
    }
    const handleUpdateComment = (e) => {
        setNewBlock({ ...newBlock, comment: e.target.value });
    }
    return (
        <article className="block-content">
            <div className="conditions">
                <h3>Condiciones</h3>
                {newBlock.conditions.map(condition => (
                    <section className="condition-item">
                        <Condition
                            key={condition.id}
                            condition={condition}
                            updateCondition={(updates) => handleUpdateCondition(condition, updates)}
                        />
                        <FaTrash style={{color: 'red'}} className=" button absolute top right" onClick={() => handleDeleteCondition(condition.id)} />
                    </section>
                ))}
                <button onClick={addCondition}>Añadir Condición</button>
            </div>
            <div className="actions">

                <Action
                    key={newBlock.action.id}
                    action={newBlock.action}
                    updateAction={handleUpdateAction}
                />

            </div>
            <div className="conditions">
                <h3>Comentario</h3>
                <input id="comment" value={newBlock.comment} onChange={handleUpdateComment} />
            </div>
            <section className="block-edit-buttons">
                <button onClick={handleReset}>Reiniciar</button>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={onCancel}>Cancelar</button>
            </section>
        </article>
    )

}

export default BlockEditor