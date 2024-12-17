/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- DropIndex
DROP INDEX "Reservation_ticketId_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "ticketId",
ADD COLUMN     "orderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Ticket";

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_orderId_key" ON "Reservation"("orderId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
