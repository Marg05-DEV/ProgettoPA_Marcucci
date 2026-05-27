import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const msg = req.headers.msg
    console.log('Ricevuto messaggio: ' + msg);
    res.send('Server funzionante! ' + msg);
});

export default app;