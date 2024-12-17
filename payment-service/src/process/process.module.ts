import { ProcessService } from '@/process/process.service';
import { WorkerService } from '@/worker/worker.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [ProcessService, WorkerService]
})
export class ProcessModule {}
