import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketService } from '@/ticket/ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @MessagePattern('ticket.deliver')
  async handleOrderCreate(@Payload() data: { userId: string; orderId: string; paymentId: string }) {
    await this.ticketService.deliver(data);
  }
}
