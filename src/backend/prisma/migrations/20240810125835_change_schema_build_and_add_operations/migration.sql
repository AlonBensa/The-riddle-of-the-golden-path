/*
  Warnings:

  - You are about to drop the column `planeId` on the `DroneDeparture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "DroneDeparture" DROP CONSTRAINT "DroneDeparture_planeId_fkey";

-- AlterTable
ALTER TABLE "DroneDeparture" DROP COLUMN "planeId";

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "planeId" INTEGER NOT NULL,
    "droneDepartureId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_planeId_fkey" FOREIGN KEY ("planeId") REFERENCES "Plane"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_droneDepartureId_fkey" FOREIGN KEY ("droneDepartureId") REFERENCES "DroneDeparture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
