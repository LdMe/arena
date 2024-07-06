
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
        
        socket.on('login', async(data) => {
            try {
                console.log(`user ${data.username} logged in`);
                const user = await userController.getUserByUsername(data.username);
                if (user) {
                    console.log("user exists",user)
                   return socket.emit('login', user);
                }
                userController.createUser(data);
            }
            catch (e) {
                console.error(e);
            }
    
        });
        socket.on('startGame', async (data) => {
            try {
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