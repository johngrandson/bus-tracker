import { Module } from '@nestjs/common';
import { TicketController } from '@/ticket/ticket.controller';
import { TicketService } from '@/ticket/ticket.service';
import { QRCodeService } from '@/qrcode/qrcode.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TicketController],
  providers: [TicketService, PrismaService, QRCodeService]
})
export class TicketModule {}
