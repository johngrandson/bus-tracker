import { RmqOptions, Transport } from '@nestjs/microservices';

export const orderQueueConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'order_queue',
    queueOptions: {
      durable: true
    }
  }
};

export const paymentQueueConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'payment_queue',
    queueOptions: {
      durable: true
    }
  }
};

export const deliverQueueConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'deliver_queue',
    queueOptions: {
      durable: true
    }
  }
};
