/*
  Warnings:

  - A unique constraint covering the columns `[icao24]` on the table `Plane` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plane_icao24_key" ON "Plane"("icao24");
