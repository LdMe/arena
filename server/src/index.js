import express from 'express';
import http from 'http';
import cors from 'cors';
import createSocketServer from './sockets.js';
import router from './routes/router.js';
import connection from './config/db.js';
const APP_PORT = 3000;
const app = express();
app.use(cors());
const server = http.createServer(app);

app.use(express.json());
app.use('/', router);
const io = createSocketServer(server);
server.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});

