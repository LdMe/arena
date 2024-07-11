
import { Server as socketIo } from 'socket.io';
import userController from './controllers/userController.js';
import { init } from './controllers/gameController.js';
import Game from './gameLogic/game.js';
import roomController from './controllers/roomController.js';
const createSocketServer = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: '*',
        },
    });
    const rooms = {};
    
    
    io.on('connection', (socket) => {

        console.log("socket connected", socket.id);
        socket.on('login', async (data) => {
            try {

                const user = await userController.getUserByUsername(data.username);
                if (user) {
                    socket.username = data.username;
                    return socket.emit('login', user);
                }
                return socket.emit('login', { error: 'El usuario no existe' });
            }
            catch (e) {
                console.error(e);
            }
        });
        socket.on('createRoom', (room) => {
            roomController.createRoom( room, io, socket);
        });
        socket.on('getRooms', () => {
            socket.emit('updateRooms', { publicRooms: roomController.getPublicRooms() });
        });
        socket.on('joinRoom', ({ roomId, role }) => {
            roomController.joinRoom( roomId,role,io,socket);
        });
        socket.on('leaveRoom', ({ roomId }) => {
            roomController.leaveRoom( roomId,io,socket);
        });
        socket.on('startRoom', async ({ roomId, speed, fill }) => {
            roomController.startRoom( roomId,io,socket,speed,fill);
        });
        socket.on('stopRoom', ({ roomId }) => {
            roomController.stopRoom( roomId);
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
            roomController.disconnect( io, socket);
        });

    });
    return io;
};
export default createSocketServer