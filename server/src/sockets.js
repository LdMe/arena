
import { Server as socketIo } from 'socket.io';
import userController from './controllers/userController.js';
import { init } from './controllers/gameController.js';
import Game from './gameLogic/game.js';

const createSocketServer = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: '*',
        },
    });
    const rooms = {};
    const users = {};
    const getPublicRooms = (rooms) => {
        return Object.keys(rooms).filter(roomId => rooms[roomId].isPublic).map(roomId => rooms[roomId])
    }
    const stopRoom = (roomId) => {
        const room = rooms[roomId];
        if (room) {

            if(room.isPlaying){
                room.game.stop();
                room.isPlaying = false;
            }
        }
    }
    io.on('connection', (socket) => {


        socket.on('login', async (data) => {
            try {

                socket.username = data.username;
                const user = await userController.getOrCreateUser(data);
                if (user) {

                    return socket.emit('login', user);
                }
            }
            catch (e) {
                console.error(e);
            }

        });
        // create a room and join it
        socket.on('createRoom', (room) => {
            const { roomId, isPublic } = room;

            if (!rooms[roomId]) {
                const username = socket.username;
                rooms[roomId] = { owner: username, players: [], spectators: [], isPublic, maxPlayers: room.maxPlayers || 4, id: roomId, isPlaying: false };
                socket.join(roomId);
                rooms[roomId].players.push({ id: socket.id, username });

                io.to(roomId).emit('updateRoom', rooms[roomId]);
                io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
            } else {
                socket.emit('roomExists', { error: 'La arena ya existe' });
            }
        });
        socket.on('getRooms', () => {

            socket.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
        });
        socket.on('joinRoom', ({ roomId, role }) => {
            if (rooms[roomId]) {
                const username = socket.username;
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
                    rooms[roomId].players.push({ id: socket.id, username });

                } else if (role === 'spectator') {
                    rooms[roomId].spectators.push({ id: socket.id, username });

                }

                io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                io.to(roomId).emit('updateRoom', rooms[roomId]);
            } else {
                socket.emit('roomNotFound', { error: 'No existe esta sala' });
            }
        });
        socket.on('leaveRoom', ({ roomId }) => {
            if (rooms[roomId]) {
                socket.leave(roomId);
                rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
                rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
                if (rooms[roomId].players.length === 0) {
                    stopRoom(roomId);

                    io.to(roomId).emit('deleteRoom', null);
                    delete rooms[roomId];
                    io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                    return;
                }
                if (rooms[roomId].owner === socket.username || !rooms[roomId].players.some(p => p.username === rooms[roomId].owner)) {
                    rooms[roomId].owner = rooms[roomId].players[0].username;

                }
                io.to(roomId).emit('userLeft', { log: `${socket.username} ha salido` });

                io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                io.to(roomId).emit('updateRoom', rooms[roomId]);
            }
        });
        socket.on('startRoom', async ({ roomId, speed, fill }) => {
            try {
                if (rooms[roomId]) {

                    if (rooms[roomId].isPlaying) {
                        socket.emit('roomFull', { error: 'La arena ya esta en juego' });
                        return;
                    }
                    if (rooms[roomId].owner !== socket.username) return;

                    rooms[roomId].isPlaying = true;
                    const users = rooms[roomId].players.map(p => p.username);
                    io.to(roomId).emit('startGame', users);

                    io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                    const game =new Game();
                    rooms[roomId].game = game;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const players = await init({ usernames: users, speed, numPlayers: rooms[roomId].maxPlayers, fill: fill }, io.to(roomId), true,game);
                    io.to(roomId).emit('endGame', players);
                    if(rooms[roomId]){
                        rooms[roomId].isPlaying = false;

                    }
                    io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                }
            }
            catch (e) {
                console.error(e);
                socket.emit('error', { error: 'Error al iniciar el juego' });
            }
        });
        socket.on('startGame', async (data) => {
            try {
                const players = await init(data, socket);
                socket.emit('endGame', players);

            }
            catch (e) {
                console.error(e);
            }
        });


        socket.on('disconnect', () => {

            // Aquí deberías manejar la lógica para quitar el usuario de la sala correspondiente.
            for (const roomId in rooms) {
                if (!rooms[roomId].players.find(p => p.id === socket.id)) continue;
                rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
                rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
                if (rooms[roomId].players.length === 0) {
                    stopRoom(roomId);
                    delete rooms[roomId];

                    return;
                }

                io.emit('updateRooms', { publicRooms: getPublicRooms(rooms) });
                io.to(roomId).emit('updateRoom', rooms[roomId]);
            }
        });

    });
    return io;
};
export default createSocketServer