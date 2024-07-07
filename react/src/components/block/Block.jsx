import { useEffect, useState } from "react";
import Condition from "../Condition";
import Action from "../Action";
import Modal from "../modal/Modal";
import './Block.css';
import { createDefaultCondition, updateCondition } from "../../utils/condition";
import { generateBlockCode } from "../../utils/strategy";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function Block({ block, updateBlock, deleteBlock, moveBlock, resetBlock, index, maxIndex }) {
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState(generateBlockCode(block, index));
    useEffect(() => {
        setCode(generateBlockCode(block, index));
    }, [block, index]);
    const addCondition = () => {
        const newCondition = createDefaultCondition('comparison');
        updateBlock(block.id, {
            conditions: [...block.conditions, newCondition]
        });
    };


    const handleUpdateCondition = (condition, updates) => {
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
        <div className="block" style={{ border: '1px solid black', margin: '10px', padding: '10px' }} >
            <h3>Bloque {index + 1}</h3>
            {isOpen && <Modal className="full" onClose={() => setIsOpen(false)}>
                <article className="block-content">
                    <div className="conditions">
                        <h3>Condiciones</h3>
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
                    <div className="conditions">
                        <h3>Comentario</h3>
                        <input id="comment" value={block.comment} onChange={e => updateBlock(block.id, { comment: e.target.value })} />
                    </div>
                    <button onClick={() => setIsOpen(false)}>Guardar</button>
                    <button onClick={() => resetBlock(block.id)}>Limpiar</button>
                    <button onClick={() => deleteBlock(block.id)}>Eliminar</button>
                </article>
            </Modal>}
            <div className="code-display" >
                <SyntaxHighlighter language="javascript" style={docco}>
                    {code}
                </SyntaxHighlighter>
            </div>
            <button onClick={() => setIsOpen(true)}>Editar Bloque</button>
            {index > 0 && <button onClick={() => moveBlock(block.id, "up")}><FaArrowUp /> </button>}
            {index < maxIndex && <button onClick={() => moveBlock(block.id, "down")}><FaArrowDown /></button>}

        </div>
    );
}

export default Block