const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DatabaseService {
    async saveOperation(operation) {
        const { uuid, latitude, longitude, speed, radius, closestPlane } = operation;
        const { icao24, callsign, origin_country, position_source } = closestPlane;
    
        let plane = await prisma.plane.findUnique({
            where: { icao24 },
        });
    
        if (!plane) {
            plane = await prisma.plane.create({
                data: {
                    icao24,
                    callsign,
                    origin_country,
                    position_source,
                },
            });
        }
    
        let droneDeparture = await prisma.droneDeparture.findUnique({
            where: { uuid },
        });
    
        if (!droneDeparture) {
            droneDeparture = await prisma.droneDeparture.create({
                data: {
                    uuid,
                    latitude,
                    longitude,
                    speed,
                    radius,
                    planeId: plane.id,
                },
            });
        }
    
        return droneDeparture;
    }

    async getSavedOperations() {
        const planes = await prisma.plane.findMany({
            include: {
                droneDepartures: true,
            },
        });

        return planes;
    }
}

module.exports = DatabaseService;