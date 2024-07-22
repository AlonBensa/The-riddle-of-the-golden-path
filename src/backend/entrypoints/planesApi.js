const express = require('express');
const router = express.Router();
const PlanesService = require('../services/planesService');

const planesService = new PlanesService();

// Service to find the closest aircraft
router.post('/closest-aircraft', async (req, res) => {
    const { lat, lon, radius } = req.body;

    try {
        const planes = await planesService.getPlanes();
        const { closestPlane, minDistance } = planesService.findClosestPlane(lat, lon, radius, planes);

        if (closestPlane) {
            res.json({ closestPlane, minDistance });
        } else {
            res.json({ message: 'No aircraft within the specified radius' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Service to calculate closure time
router.post('/closure-time', (req, res) => {
    const { distance, speed } = req.body;

    try {
        const closureTime = planesService.calculateClosureTime(distance, speed);
        res.json({ closureTime });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Aggregate service to evaluate threat
router.post('/evaluate-threat', async (req, res) => {
    const { lat, lon, speed, radius } = req.body;

    try {
        const planes = await planesService.getPlanes();
        const { closestPlane, minDistance } = planesService.findClosestPlane(lat, lon, radius, planes);

        if (closestPlane) {
            const closureTime = planesService.calculateClosureTime(minDistance, speed);
            res.json({ closestPlane, minDistance, closureTime });
        } else {
            res.json({ message: 'No aircraft within the specified radius' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Service to calculate vector-based closure time
router.post('/vector-closure-time', (req, res) => {
    const { hostile, friendly, hostileSpeed } = req.body;

    try {
        const closureTime = planesService.calculateVectorClosureTime(hostile, friendly, hostileSpeed);
        res.json({ closureTime });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
