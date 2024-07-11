import { useState, useReducer, useEffect } from 'react'
import StrategyBuilder from './components/strategy/StrategyBuilder'
import Menu from './components/menu/Menu';
import { createDefaultBlock } from './utils/condition';
import './App.css'
import Register from './components/register/Register';
import Game from './components/game/Game';
import {  updateBlocks, getUserData } from './utils/fetch';
import socket from './utils/socket';
import Coliseum from './components/coliseum/Coliseum';
import Introduction from './components/intro/Intro';
import Scores from './components/scores/Scores';
// Reducer para manejar el estado complejo
function strategyReducer(state, action) {
  switch (action.type) {
    case 'ADD_BLOCK':
      const blocks = [...state, createDefaultBlock()];
      return blocks;
    case 'UPDATE_BLOCK':
      const updatedBlocks = state.map(block =>
        block.id === action.payload.id ? { ...block, ...action.payload.updates } : block
      );
      return updatedBlocks;
    case 'DELETE_BLOCK':
      const remainingBlocks = state.filter(block => block.id !== action.payload);
      return remainingBlocks;
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
      return newBlocks;
    default:
      return state;
  }
}

function App() {
  const [state, setState] = useState("register")
  const [blocks, dispatch] = useReducer(strategyReducer, []);
  const [userData, setUserData] = useState({});
  useEffect(() => {
    if(!userData.username) return;
    socket.connect();
    socket.emit("login", { username: userData.username });
    console.log("connected")
    socket.on("login", (data) => {
      console.log("login", data)
      if (data.error) {
        handleChangeState("register");
      }
    })
    return () => {
      socket.off("login");
      socket.disconnect();
    }
  }, [userData])
  useEffect(() => {
    handleGetUserData();
  }, [])
  const handleGetUserData = async () => {
    const user = await getUserData();
    console.log("user", user)
    if(user.error)  return handleChangeState("register");
    setUserData(user);
    if(state === "register") handleChangeState("menu");
  }
 /*  useEffect(() => {
    loadBlocks();
  }, [state,userData]);
  const loadBlocks = async () => {
    if(!userData.username) return;
    const newBlocks = await getBlocks();
    if(newBlocks.error){
      handleChangeState("register");
    }
    dispatch({ type: 'SET_BLOCKS', payload: newBlocks });
  } */
  const handleSubmitUserData = async ({ user, isNew }) => {
    setUserData(user);
    dispatch({ type: 'SET_BLOCKS', payload: user.blocks });
    socket.emit("login", { username: user.username });
    if (isNew) {
      handleChangeState("intro");
    } else {
      handleChangeState("menu")
    }
  };
  const handleCreateStrategy = async () => {
    const newBlocks = await updateBlocks(blocks);
    if(newBlocks.error) handleChangeState("register");

    dispatch({ type: 'SET_BLOCKS', payload: newBlocks });
    //handleChangeState("menu");
  }
  const handleChangeState = (newState) => {

    setState(newState);
  }
  return (
    <>
      {state === "register" && (
        <Register onSubmit={handleSubmitUserData} />
      )}
      {state === "menu" && (
        <Menu onEnd={handleChangeState} username={userData.username} />
      )}
      {state === "game" && (
        <>
          <Game blocks={blocks} userData={userData} onEnd={handleChangeState} socket={socket} />
          {/* <GameCanvas log={addLog} strategy={{ name: userData.username, blocks }} />
          <Log log={log} /> */}
        </>
      )}
      {state === "coliseum" && (
        <Coliseum onEnd={handleChangeState} socket={socket} username={userData.username} />
      )}
      {state === "intro" && (
        <Introduction onEnd={handleChangeState} />
      )}
      {state === "scores" && (
        <Scores onEnd={handleChangeState} />
      )}
      {state === "builder" && (
        <div className="builder">
          <StrategyBuilder blocks={blocks} dispatch={dispatch} />
          <section className='footer'>
            <button onClick={handleCreateStrategy}>Guardar</button>
            <button onClick={() => handleChangeState("menu")}>Volver</button>
          </section>
        </div>
      )}
      {/* <StrategyBuilder blocks={blocks} dispatch={dispatch} />
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Parar' : 'Comenzar'}</button>
      {playing && <GameCanvas log={addLog} strategy={{ name: username, blocks }} />} */}

    </>
  )
}

export default App
