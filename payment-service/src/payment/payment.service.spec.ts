import { LockService } from '@/lock/lock.service';
import { PaymentService } from '@/payment/payment.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let lockService: LockService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, LockService, PrismaService]
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
    lockService = module.get<LockService>(LockService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(paymentService).toBeDefined();
    expect(lockService).toBeDefined();
    expect(prisma).toBeDefined();
  });
});
