/*
  Warnings:

  - A unique constraint covering the columns `[ticketId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ticketId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "ticketId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_ticketId_key" ON "Order"("ticketId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
