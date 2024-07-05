import  {  useReducer } from 'react';
import Block from './Block';
import CodeDisplay from './CodeDisplay';



function StrategyBuilder({blocks, dispatch}) {

  const addBlock = () => {
    dispatch({ type: 'ADD_BLOCK' });
  };

  const updateBlock = (id, updates) => {

    dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates } });
  };
  const handleMoveBlock = (id, direction) => {
    dispatch({ type: 'MOVE_BLOCK', payload: { id, direction } });
  };
  const deleteBlock = (id) => {
    dispatch({ type: 'DELETE_BLOCK', payload: id });
  };
  const handleResetBlock = (id) => {
    dispatch({ type: 'RESET_BLOCK', payload: id });
  }
  console.log("blocks",blocks)
  return (
    <div>
      <h2>Construye tu estrategia</h2>
      {blocks.map((block,index) => (
        <Block 
          key={block.id} 
          index={index}
          maxIndex={blocks.length-1}
          block={block} 
          updateBlock={updateBlock} 
          deleteBlock={deleteBlock} 
          moveBlock={handleMoveBlock}
          resetBlock={handleResetBlock}
        />
      ))}
      <button onClick={addBlock}>Añadir Bloque</button>
      <CodeDisplay blocks={blocks} />
    </div>
  );
}






export default StrategyBuilder;