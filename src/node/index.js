const express = require('express');

// Constants
const PORT = process.env.PORT || 8000;

// Routes
const chat = require('./routes/chat');

// App
const app = express();

app.all('/', (req, res) => res.sendStatus(200));
app.use('/chat', chat);

app.listen(PORT);
console.log(`Running on port ${PORT}`);

// start jobs
require('./cron');