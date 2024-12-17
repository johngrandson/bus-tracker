import { WorkerService } from '@/worker/worker.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProcessService {
  constructor(private readonly workerService: WorkerService) {}

  private async *getData(): AsyncGenerator<{ message: string; length: number }> {
    for (let i = 0; i < 100; i++) {
      yield { message: 'done', length: i };
    }

    yield* this.getData();
  }

  @OnEvent('start')
  async handler() {
    let totalItems = 0;

    const worker = await this.workerService.handler({
      limit: 10,
      onMessage: (length: number) => {
        totalItems += length;

        if (totalItems !== 0) return;

        worker.killAll();
      }
    });

    for await (const data of this.getData()) {
      worker.send(data);
    }
  }
}
