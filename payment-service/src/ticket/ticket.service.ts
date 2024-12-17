import { PrismaService } from '@/prisma/prisma.service';
import { QRCodeService } from '@/qrcode/qrcode.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly qrCodeService: QRCodeService
  ) {}
  async deliver(data: { userId: string; orderId: string; paymentId: string }) {
    this.logger.log(`Delivering ticket for order ID ${data.orderId} to user ID ${data.userId}`);
    const base64Image = await this.qrCodeService.generateQRCode(data);

    if (!this.prisma.ticket) {
      throw new Error('Prisma ticket model is not available');
    }

    let ticket;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      ticket = await this.prisma.ticket.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          qrcode: base64Image
        }
      });
    } catch (error) {
      this.logger.error('Error creating ticket', error);
      throw new Error('Failed to create ticket');
    }

    this.logger.log(ticket);
  }
}
