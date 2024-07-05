import { Game } from "./game";
import {Player } from "./player";

self.onmessage = (e) => {
    console.log("message received", e.data);
    const { playerData, runs,canvas} = e.data;
    const players = playerData.map((player) => {
        const strategy = new Function('self','enemies',`return (${player.playStrategy})(self,enemies)`);
        return new Player(player.name, player.health, player.energy, player.isDefending, player.play, player.image,strategy)
    });
    const results = Game.simulate(runs, players,canvas);
    self.postMessage(results);
};