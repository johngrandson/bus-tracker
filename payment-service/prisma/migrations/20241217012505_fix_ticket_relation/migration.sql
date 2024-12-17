/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_ticketId_fkey";

-- DropIndex
DROP INDEX "Order_ticketId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "ticketId";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
