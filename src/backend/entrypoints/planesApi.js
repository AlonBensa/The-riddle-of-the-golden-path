const express = require('express');
const router = express.Router();
const PlanesService = require('../services/planesService');

const planesService = new PlanesService();

// Service to find the closest aircraft
router.post('/closest-aircraft', async (req, res) => {
    const { dronesDeparture, planesAmount } = req.body;

    try {
        const planes = await planesService.getPlanes(planesAmount);
        const results = planesService.findClosestPlanes(dronesDeparture, planes);
        res.json(results);
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
router.post('/evaluate-threats', async (req, res) => {
    const { dronesDeparture, planesAmount } = req.body;

    try {
        const planes = await planesService.getPlanes(planesAmount);
        const { closestPlanes, minDistances, messages } = planesService.findClosestPlanes(dronesDeparture, planes);

        const closureTimes = [];
        const vectorClosureTimes = [];

        dronesDeparture.forEach((departure, index) => {
            const { latitude, longitude, radius, speed } = departure;
            closureTimes.push(planesService.calculateClosureTime(minDistances[index], speed));
            // vectorClosureTimes.push(planesService.calculateVectorClosureTime(closestPlanes[index], departure, speed));
        });

        res.json({ closestPlanes, minDistances, closureTimes, vectorClosureTimes, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Service to calculate vector-based closure time
router.post('/vector-closure-time', (req, res) => {
    const { hostile, friendly } = req.body;

    try {
        const closureTime = planesService.calculateVectorClosureTime(hostile, friendly);
        res.json({ closureTime });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
