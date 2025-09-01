const express = require('express');
const eventEmitter = require('./eventLogger');
const { delayMessage } = require('./delay');

const app = express();
const PORT = 3000;


app.get('/test', (req, res) => {
    res.send("Test route is working!");
});


app.get('/emit', (req, res) => {
    const { message } = req.query;

    if (!message) {
        return res.status(400).json({ error: "Please provide a message query parameter" });
    }

    const timestamp = new Date().toISOString();
    eventEmitter.emit('log', message);

    res.json({
        status: "Event logged",
        timestamp
    });
});


app.get('/delay', async (req, res) => {
    const { message, time } = req.query;

    if (!message || !time || isNaN(time)) {
        return res.status(400).json({ error: "Please provide message and valid time (in ms) query parameters" });
    }

    const result = await delayMessage(message, parseInt(time));
    res.json(result);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
