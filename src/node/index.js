const express = require('express');
const cors = require('cors');

// Constants
const PORT = process.env.PORT || 8000;

// Routes
const chat = require('./routes/chat');

// App
const app = express();
app.use(cors());

app.use(express.static('public'));
app.use('/chat', chat);

app.listen(PORT);
console.log(`Running on port ${PORT}`);

// start jobs
require('./cron');