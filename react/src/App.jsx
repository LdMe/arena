import { useState, useReducer, useEffect } from 'react'
import StrategyBuilder from './components/StrategyBuilder'
import Map from './components/Map';
import { createDefaultBlock } from './utils/condition';
import './App.css'
import Register from './components/register/Register';
import Game from './components/game/Game';
import { login, updateBlocks,getBlocks } from './utils/fetch';
import socket from './utils/socket';
function resetBlock(state, action) {
  const defaultBlock = createDefaultBlock();
  const id = action.payload;
  const index = state.findIndex(block => block.id === id);
  const newBlocks = [...state];
  newBlocks[index] = defaultBlock;
  localStorage.setItem('blocks', JSON.stringify(newBlocks));
  return newBlocks;
}
// Reducer para manejar el estado complejo
function strategyReducer(state, action) {
  switch (action.type) {
    case 'ADD_BLOCK':
      const blocks = [...state, createDefaultBlock()];
      localStorage.setItem('blocks', JSON.stringify(blocks));
      return blocks;
    case 'UPDATE_BLOCK':
      const updatedBlocks = state.map(block =>
        block.id === action.payload.id ? { ...block, ...action.payload.updates } : block
      );
      localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
      return updatedBlocks;
    case 'DELETE_BLOCK':
      const remainingBlocks = state.filter(block => block.id !== action.payload);
      localStorage.setItem('blocks', JSON.stringify(remainingBlocks));
      return remainingBlocks;
    case 'RESET_BLOCK':
      return resetBlock(state, action);
    case 'RESET_BLOCKS':
      localStorage.removeItem('blocks');
      return [];
    case 'SET_BLOCKS':
      return action.payload;
    case 'MOVE_BLOCK':
      const index = state.findIndex(block => block.id === action.payload.id);
      const direction = action.payload.direction;
      const newBlocks = [...state];
      if (direction === 'up' && index > 0) {
        newBlocks[index - 1] = state[index];
        newBlocks[index] = state[index - 1];
      } else if (direction === 'down' && index < state.length - 1) {
        newBlocks[index + 1] = state[index];
        newBlocks[index] = state[index + 1];
      }
      localStorage.setItem('blocks', JSON.stringify(newBlocks));
      return newBlocks;
    default:
      return state;
  }
}

function App() {
  const [state, setState] = useState("register")
  const [blocks, dispatch] = useReducer(strategyReducer, []);
  const [log, setLog] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    }
  }, [userData])
  useEffect(() => {
    loadBlocks();
  }, [state]);
  const loadBlocks = async () => {
    const newBlocks = await getBlocks();
    console.log("newBlocks",newBlocks)
    dispatch({ type: 'SET_BLOCKS', payload: newBlocks });
  }
  const addLog = (text) => {
    setLog(prevLog => [...prevLog, text]);
  };
  const handleSubmitUserData = async (data) => {
    setUserData(data);
    dispatch({ type: 'SET_BLOCKS', payload: data.blocks });
    //socket.emit("login", { username: data.username });
    handleChangeState("map")
  };
  const handleCreateStrategy = async () => {
    await updateBlocks(blocks);
    handleChangeState("map");
  }
  const handleChangeState = (newState) => {
    setState(newState);
  }
  return (
    <>
      {state === "register" && (
        <Register onSubmit={handleSubmitUserData} />
      )}
      {state === "map" && (
        <Map onEnd={handleChangeState} />
      )}
      {state === "game" && (
        <>
          <Game blocks={blocks} userData={userData} onEnd={handleChangeState} socket={socket} />
          {/* <GameCanvas log={addLog} strategy={{ name: userData.username, blocks }} />
          <Log log={log} /> */}
        </>
      )}
      {state === "builder" && (
        <>
          <StrategyBuilder blocks={blocks} dispatch={dispatch} />
          <button onClick={handleCreateStrategy}>Guardar</button>
          <button onClick={() => handleChangeState("map")}>Volver</button>
        </>
      )}
      {/* <StrategyBuilder blocks={blocks} dispatch={dispatch} />
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Parar' : 'Comenzar'}</button>
      {playing && <GameCanvas log={addLog} strategy={{ name: username, blocks }} />} */}

    </>
  )
}

export default App
