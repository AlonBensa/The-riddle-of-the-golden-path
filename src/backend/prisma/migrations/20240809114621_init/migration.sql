-- CreateTable
CREATE TABLE "Plane" (
    "id" SERIAL NOT NULL,
    "icao24" TEXT NOT NULL,
    "callsign" TEXT,
    "origin_country" TEXT NOT NULL,
    "sensors" TEXT[],
    "position_source" INTEGER NOT NULL,

    CONSTRAINT "Plane_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DroneDeparture" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "planeId" INTEGER NOT NULL,

    CONSTRAINT "DroneDeparture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DroneDeparture" ADD CONSTRAINT "DroneDeparture_planeId_fkey" FOREIGN KEY ("planeId") REFERENCES "Plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
