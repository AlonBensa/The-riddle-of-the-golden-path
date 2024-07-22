const express = require('express');
const bodyParser = require('body-parser');
const planesApi = require('./planesApi');
const databaseApi = require('./databaseApi');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use('/api/planes', planesApi);
app.use('/api/database', databaseApi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
