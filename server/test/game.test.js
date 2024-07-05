import {init} from '../src/controllers/gameController.js';


describe("test de inicialización de un juego ",()=>{

    test("test de inicialización de un juego ",()=>{
        const action = {type: "attack",target:"minEnergy"};
        const blocks = [{id:"1234",action, conditions:[]}];
        const strategy = {name: "test", blocks, random: true};
        const game = init(strategy);
        expect(game).toBeDefined();
    })
})
