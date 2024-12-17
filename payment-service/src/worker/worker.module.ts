import { WorkerService } from '@/worker/worker.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [WorkerService]
})
export class WorkerModule {}
