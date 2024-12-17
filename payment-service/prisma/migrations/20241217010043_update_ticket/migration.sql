/*
  Warnings:

  - You are about to drop the column `lockedBy` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_ticketId_fkey";

-- DropIndex
DROP INDEX "Reservation_ticketId_idx";

-- DropIndex
DROP INDEX "Ticket_orderId_idx";

-- DropIndex
DROP INDEX "Ticket_orderId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "ticketId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "lockedBy",
DROP COLUMN "orderId";

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_ticketId_key" ON "Reservation"("ticketId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
