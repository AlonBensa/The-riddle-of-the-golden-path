/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `DroneDeparture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `DroneDeparture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DroneDeparture" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DroneDeparture_uuid_key" ON "DroneDeparture"("uuid");
