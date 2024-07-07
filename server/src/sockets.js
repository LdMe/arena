
import { Server as socketIo } from 'socket.io';
import userController from './controllers/userController.js';
import { init } from './controllers/gameController.js';

const createSocketServer = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: '*',
        },
    });
    const rooms = {};
    const users = {};
    io.on('connection', (socket) => {
        console.log('new connection', socket.id);

        socket.on('login', async (data) => {
            try {
                console.log(`user ${data.username} logged in`);
                socket.username = data.username;
                const user = await userController.getOrCreateUser(data);
                if (user) {
                    console.log("user exists", user)
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
            console.log("createRoom", room)
            if (!rooms[roomId]) {
                const username = socket.username;
                rooms[roomId] = { owner: username, players: [], spectators: [], isPublic, maxPlayers: room.maxPlayers || 4 ,id: roomId,isPlaying:false};
                socket.join(roomId);
                rooms[roomId].players.push({ id: socket.id, username });
                console.log(`${username} created and joined room ${roomId}`);
                io.to(roomId).emit('updateRoom', rooms[roomId]);
                io.emit('updateRooms', { publicRooms: Object.keys(rooms).filter(roomId => rooms[roomId].isPublic).map(roomId =>  rooms[roomId]) });
            } else {
                socket.emit('error', { message: 'Room already exists' });
            }
        });
        socket.on('getRooms', () => {
            const publicRooms = Object.keys(rooms).filter(roomId => rooms[roomId].isPublic).map(roomId =>  rooms[roomId]);
            socket.emit('updateRooms', { publicRooms });
        });
        socket.on('joinRoom', ({ roomId, role }) => {
            if (rooms[roomId]) {
                const username = socket.username;
                socket.join(roomId);
                if (role === 'player') {
                    rooms[roomId].players.push({ id: socket.id, username });
                    console.log(`${username} joined room ${roomId} as player`);
                } else if (role === 'spectator') {
                    rooms[roomId].spectators.push({ id: socket.id, username });
                    console.log(`${username} joined room ${roomId} as spectator`);
                }
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
                if(rooms[roomId].players.length === 0) {
                    delete rooms[roomId];
                    console.log(`room ${roomId} deleted`);
                    io.emit('updateRooms', { publicRooms: Object.keys(rooms).filter(roomId => rooms[roomId].isPublic).map(roomId =>  rooms[roomId]) });
                    return;
                }
                if (rooms[roomId].owner === socket.username || !rooms[roomId].players.some(p => p.username === rooms[roomId].owner)) {
                    rooms[roomId].owner = rooms[roomId].players[0].username;
                    console.log(`room ${roomId} owner changed to ${rooms[roomId].owner}`);
                }
                io.to(roomId).emit('log', { log: `${socket.username} ha salido` });

                io.to(roomId).emit('updateRoom', rooms[roomId]);
            }
        });
        socket.on('startRoom', async ({ roomId,speed }) => {
            if (rooms[roomId]) {
                console.log("starting room", roomId)
                if(rooms[roomId].owner !== socket.username) return;
                rooms[roomId].isPlaying = true;
                const users = rooms[roomId].players.map(p => p.username);
                io.to(roomId).emit('startGame', users);
                await new Promise(resolve => setTimeout(resolve, 1000));
                const players = await init({ usernames: users,speed}, io.to(roomId),true);
            }
        });
        socket.on('startGame', async (data) => {
            try {
                const players = await init(data, socket);
                console.log("finished", players);
            }
            catch (e) {
                console.error(e);
            }
        });


        socket.on('disconnect', () => {
            console.log('disconnected', socket.id);
            // Aquí deberías manejar la lógica para quitar el usuario de la sala correspondiente.
            for (const roomId in rooms) {
                if (!rooms[roomId].players.find(p => p.id === socket.id)) continue;
                rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
                rooms[roomId].spectators = rooms[roomId].spectators.filter(s => s.id !== socket.id);
                if(rooms[roomId].players.length === 0) {
                    delete rooms[roomId];
                    console.log(`room ${roomId} deleted`);
                    return;
                }
                io.to(roomId).emit('updateRoom', rooms[roomId]);
            }
        });

    });
    return io;
};
export default createSocketServer