/*
  Warnings:

  - You are about to drop the column `orderId` on the `Ticket` table. All the data in the column will be lost.
  - Made the column `ticketId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_orderId_fkey";

-- DropIndex
DROP INDEX "Ticket_orderId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "ticketId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "orderId";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
