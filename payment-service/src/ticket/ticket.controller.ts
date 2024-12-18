import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TicketService } from '@/ticket/ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @EventPattern('ticket.deliver.success')
  async handleDeliverTicket(
    @Payload() data: { userId: string; orderId: string; paymentId: string }
  ) {
    await this.ticketService.deliver(data);
  }
}
