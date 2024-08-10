const express = require('express');
const router = express.Router();
const PlanesService = require('../services/planesService');


const planesService = new PlanesService();

// Service to find the closest aircraft
router.post('/closest-aircraft', async (req, res) => {
    const { droneDeparture, planesAmount } = req.body;

    try {
        const planes = await planesService.getPlanes(planesAmount);
        const result = planesService.findClosestPlane(droneDeparture, planes);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Service to calculate closure time
router.post('/closure-time', (req, res) => {
    const { hostile, friendly } = req.body;

    try {
        const closureTime = planesService.calculateClosureTime(hostile, friendly);
        res.json({ closureTime });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

// Aggregate service to evaluate threat
router.post('/evaluate-threats', async (req, res) => {
    const { droneDeparture, planesAmount } = req.body;

    try {
        const planes = await planesService.getPlanes(planesAmount);
        const { closestPlane, minDistance, message } = planesService.findClosestPlane(droneDeparture, planes);
        
        if (!closestPlane) {
            res.json({ closestPlane: null, minDistance: null, closureTime: null, vectorClosureTime: null, message, droneDepartureUuid: droneDeparture.uuid });
            return;
        }

        const closureTime = planesService.calculateClosureTime(droneDeparture, closestPlane);
        // const vectorClosureTime = planesService.calculateVectorClosureTime(droneDeparture, closestPlane);

        res.json({ closestPlane, minDistance, closureTime, vectorClosureTime: 0, message, droneDepartureUuid: droneDeparture.uuid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
