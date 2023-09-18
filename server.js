import express from 'express';
import cors from 'cors';
import loginRouter from './routes/login/login-routers.js';
import ws from 'ws';
import chatMessages from './db/chatMessages-db.js';
import loginData from './db/nicknames-db.js';

const app = express();
const port = process.env.PORT || 7070;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRouter);

const wsServer = new ws.Server({ noServer: true });

wsServer.on('connection', socket => {
  console.log('Hello from server!!!')
  // при подключении клиента, отправляем ему активные логины для отрисовки
  Array.from(wsServer.clients)
  .filter(client => client.readyState === ws.OPEN)
  .forEach(client => client.send(JSON.stringify({ loginData: loginData.data })));

  socket.on('message', data => {
    const messageObj = JSON.parse(data);
    chatMessages.add(messageObj);
    const messageObjSend = JSON.stringify({ message: messageObj })

    // отправляем сообщения на все активные клиенты
    Array.from(wsServer.clients)
      .filter(client => client.readyState === ws.OPEN)
      .forEach(client => client.send(messageObjSend));
  });

  //при закрытии очищаем историю
  socket.on('close', () => {
    chatMessages.data = [];
    loginData.data = [];
  })

});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
})

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

