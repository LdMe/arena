import { useState, useEffect } from 'react';
import { generateStrategyCode } from '../utils/strategy';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
function CodeDisplay({ blocks }) {
    const [code, setCode] = useState("");

    useEffect(() => {
        setCode(generateStrategyCode(blocks));
    }, [blocks]);



    return (
        <div className="code-display" style={{ marginTop: '20px' }}>
            <h3>Código de la Estrategia:</h3>
            <SyntaxHighlighter language="javascript" style={docco}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

export default CodeDisplay