const express = require('express');
const router = express.Router();
const DatabaseService = require('../services/databaseService');

const databaseService = new DatabaseService();

router.post('/save-operation', async (req, res) => {
    const { latitude, longitude, speed, radius, closestPlane } = req.body;

    try {
        await databaseService.saveOperation({ latitude, longitude, speed, radius, closestPlane });
        res.json({ message: 'Operation saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save operation' });
    }
});

router.get('/saved-operations', async (req, res) => {
    try {
        const operations = await databaseService.getSavedOperations();
        res.json(operations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve saved operations' });
    }
});

module.exports = router;
