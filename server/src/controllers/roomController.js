import Game from "../gameLogic/game.js"
import { init } from './gameController.js';
const rooms = {}
const getPublicRooms = () => {
    return Object.keys(rooms).filter(roomId => rooms[roomId].isPublic).map(roomId => rooms[roomId])
}
const createRoom = (room, io, socket) => {
    try{
    const { roomId, isPublic } = room;
    if (!rooms[roomId]) {
        const username = socket.username;
        rooms[roomId] = { owner: username, players: [], spectators: [], isPublic, maxPlayers: room.maxPlayers || 4, id: roomId, isPlaying: false };
        socket.join(roomId);
        rooms[roomId].players.push({ id: socket.id, username });

        io.to(roomId).emit('updateRoom', rooms[roomId]);
        io.emit('updateRooms', { publicRooms: getPublicRooms() });
    } else {
        socket.emit('roomExists', { error: 'La arena ya existe' });
    }
    return rooms
    }catch(e){
        console.error(e);
    }
}
const stopRoom = (room) => {
    try{
    if (room) {
        if (room.isPlaying) {
            room.game.stop();
            room.isPlaying = false;
        }
    }
    return rooms
    }catch(e){
        console.error(e);
    }
}
const deleteRoom = (roomId) => {
    try{
    if (rooms[roomId]) {
        delete rooms[roomId];
    }
    return rooms
    }catch(e){
        console.error(e);
    }
}
const joinRoom = (roomId, role, io, socket) => {
    try{
    if (rooms[roomId]) {
        const username = socket.username;
        console.log(`user ${username} joined room ${roomId} with role ${role}`);
        const userAlreadyInRoom = role === 'player' ? rooms[roomId].players.find(player => player.username === username) : rooms[roomId].spectators.find(spectator => spectator.username === username);
        if (userAlreadyInRoom) {
            return;
        }
        socket.join(roomId);
        if (role === 'player') {
            if (rooms[roomId].players.length >= rooms[roomId].maxPlayers) {
                socket.emit('roomFull', { error: 'La arena ya esta llena' });
                return;
            }
            if (rooms[roomId].isPlaying) {
                socket.emit('roomFull', { error: 'La arena ya esta en juego' });
                return;
            }
            rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
            rooms[roomId].players.push({ id: socket.id, username });

        } else if (role === 'spectator') {
            rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
            rooms[roomId].spectators.push({ id: socket.id, username });

        }

        io.emit('updateRooms', { publicRooms: getPublicRooms() });
        io.to(roomId).emit('updateRoom', rooms[roomId]);
    } else {
        socket.emit('roomNotFound', { error: 'No existe esta arena' });
    }

    return rooms
    }catch(e){
        console.error(e);
    }

}
const leaveRoom = (roomId, io, socket) => {
    try{
    if (rooms[roomId]) {
        socket.leave(roomId);
        rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
        rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
        if (rooms[roomId].players.length === 0 && !rooms[roomId].spectators.some(s => s.username === rooms[roomId].owner)) {
            stopRoom(rooms[roomId]);
            io.to(roomId).emit('deleteRoom', null);
            delete rooms[roomId];
            io.emit('updateRooms', { publicRooms: getPublicRooms() });
            return;
        }
        if (rooms[roomId].owner === socket.username || (!rooms[roomId].players.some(p => p.username === rooms[roomId].owner) && !rooms[roomId].spectators.some(s => s.username === rooms[roomId].owner))) {
            rooms[roomId].owner = rooms[roomId].players[0].username;

        }
        io.to(roomId).emit('userLeft', { log: `${socket.username} ha salido` });

        io.emit('updateRooms', { publicRooms: getPublicRooms() });
        io.to(roomId).emit('updateRoom', rooms[roomId]);
    }

    return rooms
    }catch(e){
        console.error(e);
    }
};
const startRoom = async (roomId, io, socket, speed, fill) => {
    try {
        if (rooms[roomId]) {

            if (rooms[roomId].isPlaying) {
                socket.emit('roomFull', { error: 'La arena ya esta en juego' });
                return;
            }
            if (rooms[roomId].owner !== socket.username) return;
            if(rooms[roomId].players.length < 2){
                socket.emit('roomFull', { error: 'La arena debe tener al menos 2 jugadores' });
                return;
            }
            rooms[roomId].isPlaying = true;
            const users = rooms[roomId].players.map(p => p.username);
            io.to(roomId).emit('startGame', users);
            console.log("rooms", rooms);
            io.emit('updateRoom', rooms[roomId]);
            io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
            const game =new Game();
            rooms[roomId].game = game;
            await new Promise(resolve => setTimeout(resolve, 1000));
            const players = await init({ usernames: users, speed, numPlayers: rooms[roomId].maxPlayers, fill: fill }, io.to(roomId), true,game);
            if(rooms[roomId]){
                console.log("ending game of " + roomId);
                rooms[roomId].isPlaying = false;
                
            }
            io.to(roomId).emit('endGame', rooms[roomId]);
            io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
        }
    }
    catch (e) {
        console.error(e);
        socket.emit('error', { error: 'Error al iniciar el juego' });
    }
};
const disconnect = (io, socket) => {
    try {
    for (const roomId in rooms) {
        if (!rooms[roomId].players.find(p => p.id === socket.id) && !rooms[roomId].spectators.find(s => s.id === rooms[roomId].owner)) continue;
        rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
        rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
        if (rooms[roomId].players.length === 0) {
            stopRoom(rooms[roomId]);
            deleteRoom(rooms, roomId);
            return;
        }

        io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
        io.to(roomId).emit('updateRoom', rooms[roomId]);
    }

    } catch (e) {
        console.error(e);
    }

}
export default {
    createRoom,
    getPublicRooms,
    stopRoom,
    deleteRoom,
    joinRoom,
    leaveRoom,
    startRoom,
    disconnect
}