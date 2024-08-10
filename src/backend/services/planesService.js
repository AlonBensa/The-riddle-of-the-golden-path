const axios = require('axios');
const { calculateDistance, toRadians } = require('./utils');
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

    calculateVectorClosureTime(hostile, friendly) {
        const DEG_TO_RAD = Math.PI / 180;
    
        // Convert speed and heading to velocity components
        function speedToVelocity(speed, heading) {
            const headingRad = heading * DEG_TO_RAD;
            return {
                x: speed * Math.cos(headingRad),
                y: speed * Math.sin(headingRad)
            };
        }
    
        // Convert latitude and longitude to Cartesian coordinates
        function latLonToCartesian(lat, lon) {
            const R = 6371e3; // Radius of Earth in meters
            const latRad = lat * DEG_TO_RAD;
            const lonRad = lon * DEG_TO_RAD;
            return {
                x: R * Math.cos(latRad) * Math.cos(lonRad),
                y: R * Math.cos(latRad) * Math.sin(lonRad)
            };
        }
    
        const { latitude: latH, longitude: lonH, speed: speedH } = hostile;
        const { latitude: latF, longitude: lonF, speed: speedF, heading: headingF } = friendly;
    
        // Convert to Cartesian coordinates
        const posH = latLonToCartesian(latH, lonH);
        const posF = latLonToCartesian(latF, lonF);
    
        // Calculate velocity vectors
        const velH = { x: speedH, y: 0 }; // Assuming hostile moves in the direction of longitude
        const velF = speedToVelocity(speedF, headingF);
    
        // Calculate the relative position and velocity
        const pRel = {
            x: posH.x - posF.x,
            y: posH.y - posF.y
        };
        const vRel = {
            x: velH.x - velF.x,
            y: velH.y - velF.y
        };
    
        // Calculate the magnitude squared
        const vRelMagSquared = vRel.x * vRel.x + vRel.y * vRel.y;
    
        // Handle case when relative velocity is zero or very small
        if (vRelMagSquared === 0) {
            return Infinity; // They are moving parallel or stationary relative to each other
        }
    
        // Calculate the distance to closure
        const distanceToClosure = Math.sqrt(pRel.x * pRel.x + pRel.y * pRel.y);
    
        // Calculate closure time
        const closureTime = distanceToClosure / Math.sqrt(vRelMagSquared);
    
        return closureTime >= 0 ? closureTime : Infinity; 
    }
}

module.exports = PlanesService;
