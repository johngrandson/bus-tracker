import { ProcessService } from '@/process/process.service';
import { WorkerService } from '@/worker/worker.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProcessService', () => {
  let processService: ProcessService;
  let workerService: WorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessService, WorkerService]
    }).compile();

    processService = module.get<ProcessService>(ProcessService);
    workerService = module.get<WorkerService>(WorkerService);
  });

  it('should be defined', () => {
    expect(processService).toBeDefined();
    expect(workerService).toBeDefined();
  });
});
