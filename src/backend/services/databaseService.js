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
                },
            });
        }
    
        let existingOperation = await prisma.operation.findFirst({
            where: {
                planeId: plane.id,
                droneDepartureId: droneDeparture.id,
            },
        });
    
        if (existingOperation) {
            return existingOperation;
        }
    
        const newOperation = await prisma.operation.create({
            data: {
                planeId: plane.id,
                droneDepartureId: droneDeparture.id,
            },
        });
    
        return newOperation;
    }

    async getSavedOperations() {
        const operations = await prisma.operation.findMany({
            include: {
                plane: true,
                droneDeparture: true,
            },
        });
    
        return operations;
    }
}

module.exports = DatabaseService;