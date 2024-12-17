import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async reserve(orderId: string, userId: string, expiresInMinutes: number) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000);

    await this.prisma.$transaction(async (tx) => {
      const existingReservation = await tx.reservation.findFirst({
        where: {
          orderId,
          expiresAt: {
            gt: now
          }
        }
      });

      if (existingReservation) {
        throw new Error('Reservation already exists');
      }

      await tx.reservation.create({
        data: {
          orderId,
          lockedBy: userId,
          expiresAt
        }
      });
    });
  }
}
