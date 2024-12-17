import { DriversModule } from '@/drivers/drivers.module';
import { TransportGateway } from '@/transport/transport.gateway';
import { TransportService } from '@/transport/transport.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TransportGateway', () => {
  let gateway: TransportGateway;
  let service: TransportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DriversModule],
      providers: [TransportGateway, TransportService]
    }).compile();

    gateway = module.get<TransportGateway>(TransportGateway);
    service = module.get<TransportService>(TransportService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
    expect(service).toBeDefined();
  });
});
