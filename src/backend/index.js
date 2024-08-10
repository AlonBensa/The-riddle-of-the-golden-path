const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Step 2: Import cors
const planesApi = require('./entrypoints/planesApi');
const databaseApi = require('./entrypoints/databaseApi');
require('dotenv').config();

const app = express();
app.use(cors()); // Step 3: Use cors middleware
app.use(bodyParser.json());

app.use('/api/planes', planesApi);
app.use('/api/database', databaseApi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});