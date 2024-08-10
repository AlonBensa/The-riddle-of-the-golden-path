const axios = require('axios');
const { calculateDistance, calculateVectorClosureTime } = require('./utils');
require('dotenv').config();

class PlanesService {
    constructor() {
        this.apiUrl = process.env.OPEN_SKY_API_URL;
        this.apiUsername = process.env.OPEN_SKY_API_USERNAME;
        this.apiPassword = process.env.OPEN_SKY_API_PASSWORD;
    }

    async getPlanes(planesAmount = null) {
        try {
            const response = await axios.get(this.apiUrl, {
                auth: {
                    username: this.apiUsername,
                    password: this.apiPassword,
                },
            });
            
            let planesData = response.data.states;
            planesData = planesData.filter(plane => plane[5] !== null && plane[6] !== null);
            
            return planesAmount !== null ? planesData.slice(0, planesAmount) : planesData;
        } catch (error) {
            throw new Error('Failed to retrieve aircraft data: ', error);
        }
    }

    findClosestPlane(droneDeparture, planes) {
        const { latitude, longitude, radius } = droneDeparture;
        let closestPlane = null;
        let minDistance = Infinity;

        planes.forEach(plane => {
            const planeLatitude = plane[5];
            const planeLongitude = plane[6];
            const distance = calculateDistance(latitude, longitude, planeLatitude, planeLongitude);
            
            if (distance < radius && distance < minDistance) {
                minDistance = distance;
                closestPlane = {
                    icao24: plane[0],
                    callsign: plane[1],
                    origin_country: plane[2],
                    time_position: plane[3],
                    last_contact: plane[4],
                    latitude: planeLatitude,
                    longitude: planeLongitude,
                    altitude: plane[7],
                    on_ground: plane[8],
                    speed: plane[9],
                    heading: plane[10],
                    vertical_rate: plane[11],
                    sensors: plane[12],
                    geo_altitude: plane[13],
                    squawk: plane[14],
                    spi: plane[15],
                    position_source: plane[16]
                };
            }
        });

        if (closestPlane) {
            return { closestPlane: closestPlane, minDistance: minDistance, message: null}
        } else {
            return { closestPlane: null, minDistance: null, message: `No aircraft within the specified radius for departure at latitude ${latitude}, longitude ${longitude}` }
        }
    }

    calculateClosureTime(hostile, friendly) {
        const distance = calculateDistance(hostile.latitude, hostile.longitude, friendly.latitude, friendly.longitude);
        const relativeSpeed = Math.abs(friendly.speed - hostile.speed);
    
        const closureTime = distance / relativeSpeed;
        return closureTime;
    }

    calculateVectorClosureTime(hostile, friendly, hostileSpeed) {
        return calculateVectorClosureTime(hostile, friendly);
    }
}

module.exports = PlanesService;
