import { PrismaService } from '@/prisma/prisma.service';
import { ReservationService } from '@/reservation/reservation.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ReservationService, PrismaService]
})
export class ReservationModule {}
