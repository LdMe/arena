import { useEffect, useState } from "react";
import Condition from "../condition/Condition";
import Action from "../Action";
import Modal from "../modal/Modal";
import './Block.css';
import { createDefaultCondition, updateCondition } from "../../utils/condition";
import { generateBlockCode } from "../../utils/strategy";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import BlockEditor from "./BlockEditor";

function Block({ block, updateBlock, deleteBlock, moveBlock,  index, maxIndex }) {
    const [isOpen, setIsOpen] = useState(false);
    const [code, setCode] = useState(generateBlockCode(block, index));
    useEffect(() => {
        setCode(generateBlockCode(block, index));
    }, [block, index]);
    const handleUpdateBlock = (updates) => {
        updates['isEdited'] = true;
        updateBlock(block.id, updates);
        setIsOpen(false);
    }
    return (
        <div className="block" style={{ border: '1px solid black', margin: '10px', padding: '10px' }} >
            <h3>Bloque {index + 1} {block.isEdited && <span>(Editado)</span>}</h3>
            {isOpen &&
                <Modal className="full" onClose={() => setIsOpen(false)}>
                    <BlockEditor block={block} onUpdate={handleUpdateBlock} onCancel={() => setIsOpen(false)} />
                </Modal>
            }
            <div className="code-display" >
                <SyntaxHighlighter language="javascript" style={docco}>
                    {code}
                </SyntaxHighlighter>
            </div>
            <section className="block-buttons">
                <button onClick={() => deleteBlock(block.id)}>Borrar Bloque</button>
                <button onClick={() => setIsOpen(true)}>Editar Bloque</button>
                <section className="move-buttons">
                    {index > 0 && <button onClick={() => moveBlock(block.id, "up")}><FaArrowUp /> </button>}
                    {index < maxIndex && <button onClick={() => moveBlock(block.id, "down")}><FaArrowDown /></button>}
                </section>
            </section>

        </div>
    );
}

export default Block