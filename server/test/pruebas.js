import {init} from '../src/controllers/gameController.js';


const action = { type: "attack", target: "minEnergy" };
const blocks = [{ id: "1234", action, conditions: [] }];
const strategy = { name: "test", blocks, random: true };
const game = await init(strategy);

console.log(game)