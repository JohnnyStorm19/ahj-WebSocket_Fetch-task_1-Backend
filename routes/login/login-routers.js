import { Router } from 'express';
import loginData from '../../db/nicknames-db.js';
import chatMessages from '../../db/chatMessages-db.js';
import emojisData from '../../db/emojis-db.js';

const loginRouter = new Router();

loginRouter.post('/', async (req, res) => {
    const { login } = req.body;
    if (loginData.data.some(obj => obj.login === login)) {
        res.json({ error: 'Sorry, your login is already using!' });
        return;
    }
    loginData.add({ login: login, emodji: emojisData.getRandomEmoji() });

    if (chatMessages.data.length) {
        res.json({ success: 'Login added', loginData: loginData.data, messages: chatMessages.data });
        console.log('Сообщения есть!', chatMessages.data);
        return;
    }
    res.json({ success: 'Login added', loginData: loginData.data, messages: false });
    console.log('Сообщений нет!');
})

loginRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!loginData.data.some(obj => obj.id === id)) {
        res.json({ error: 'Nickname does not exist' });
        return;
    }
    loginData.data = loginData.data.filter(obj => obj.id != id);
    res.json({ success: 'Nickname deleted', loginData: loginData.data });
})


export default loginRouter;