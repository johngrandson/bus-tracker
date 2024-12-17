import { fork, ChildProcess, Serializable } from 'node:child_process';
import { Injectable } from '@nestjs/common';
import { CreateCluster, CreateClusterResponse, DataMessage, Handler } from '@/worker/types';
import { resolve } from 'node:path';
import { setTimeout } from 'node:timers/promises';

const taskFile = resolve(__dirname, './task');

@Injectable()
export class WorkerService {
  private readonly processes: Map<number, ChildProcess> = new Map();
  private readonly messageCounts: Map<number, number> = new Map();

  private getLeastLoadedProcess(): ChildProcess {
    const sortedProcesses = [...this.processes.values()].sort(
      (a, b) =>
        (this.messageCounts.get(a.pid as number) || 0) -
        (this.messageCounts.get(b.pid as number) || 0)
    );

    const selectedProcess = sortedProcesses[0];
    if (!selectedProcess || !selectedProcess.pid) {
      throw new Error('No available child processes');
    }

    this.messageCounts.set(
      selectedProcess.pid,
      (this.messageCounts.get(selectedProcess.pid) || 0) + 1
    );

    return selectedProcess;
  }

  private async createCluster({ limit, onMessage }: CreateCluster): Promise<CreateClusterResponse> {
    if (!limit || limit <= 0) {
      throw new Error('Limit must be a positive integer');
    }

    for (let i = 1; i < limit; i++) {
      const child = fork(taskFile);

      if (!child?.pid) continue;

      child.on('exit', (code) => {
        if (!child?.pid) return;

        console.log(`Child process ${child.pid} exited with code ${code}`);
        this.processes.delete(child.pid);
      });
      child.on('error', () => {
        if (!child?.pid) return;

        console.log(`Child process ${child.pid} exited with error`);
        this.processes.delete(child.pid);
      });
      child.on('message', (data: DataMessage) => {
        if (data.message !== 'done') return;
        onMessage(data.length);
      });

      if (this.processes.size < limit) {
        const newChild = fork(taskFile);
        if (!newChild?.pid) continue;
        this.processes.set(newChild.pid, newChild);
      }
    }

    await setTimeout(1000);

    return {
      getLeastLoadedProcess: this.getLeastLoadedProcess.bind(this),
      killAll: () => {
        for (const child of this.processes.values()) {
          console.log(`Killing child process ${child.pid}`);
          child.kill();
        }
      }
    };
  }

  async handler({ limit, onMessage }: Handler) {
    if (!limit || limit <= 0) {
      throw new Error('Limit must be a positive integer');
    }

    const { getLeastLoadedProcess, killAll } = await this.createCluster({ limit, onMessage });

    function send(data: Serializable) {
      const process = getLeastLoadedProcess();
      if (!process) throw new Error('No available child process');
      process?.send(data);
    }

    return {
      send: send.bind(this),
      killAll: killAll.bind(this)
    };
  }
}
