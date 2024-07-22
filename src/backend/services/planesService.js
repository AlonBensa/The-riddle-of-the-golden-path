const axios = require('axios');
const { calculateDistance, calculateVectorClosureTime } = require('./utils');

class PlanesService {
    constructor() {
        this.apiUrl = process.env.OPEN_SKY_API_URL;
        this.apiUsername = process.env.OPEN_SKY_API_USERNAME;
        this.apiPassword = process.env.OPEN_SKY_API_PASSWORD;
    }

    async getPlanes() {
        try {
            const response = await axios.get(this.apiUrl, {
                auth: {
                    username: this.apiUsername,
                    password: this.apiPassword,
                },
            });
            return response.data.states;
        } catch (error) {
            throw new Error('Failed to retrieve aircraft data');
        }
    }

    findClosestPlane(lat, lon, radius, planes) {
        let closestPlane = null;
        let minDistance = Infinity;

        planes.forEach(plane => {
            const distance = calculateDistance(lat, lon, plane[6], plane[5]);
            if (distance < radius && distance < minDistance) {
                minDistance = distance;
                closestPlane = plane;
            }
        });

        return { closestPlane, minDistance };
    }

    calculateClosureTime(distance, speed) {
        if (speed <= 0) {
            throw new Error('Speed must be greater than zero');
        }
        return distance / speed;
    }

    calculateVectorClosureTime(hostile, friendly, hostileSpeed) {
        return calculateVectorClosureTime(hostile, friendly, hostileSpeed);
    }
}

module.exports = PlanesService;
