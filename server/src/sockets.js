
import { Server as socketIo } from 'socket.io';
import userController from './controllers/userController.js';
import { init } from './controllers/gameController.js';

const createSocketServer = (server) => {
    const io = new socketIo(server, {
        cors: {
            origin: '*',
        },
    });
    
    io.on('connection', (socket) => {
        console.log('new connection', socket.id);
        
        socket.on('login', (data) => {
            try {
                console.log(`user ${data.username} logged in`);
                
            }
            catch (e) {
                console.error(e);
            }
    
        });
        socket.on('startGame', async (data) => {
            try {
                console.log("start game")
                console.log("data:",data)
                const players = await init(data,socket);
                console.log("finished",players);
            }
            catch (e) {
                console.error(e);
            }
        });

        
        socket.on('disconnect', () => {
            console.log('disconnected', socket.id);
        });

    });
    return io;
};
export default createSocketServer