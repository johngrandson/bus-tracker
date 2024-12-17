import { ChildProcess } from 'node:child_process';

export type CreateCluster = {
  limit: number;
  onMessage: (message: any) => void;
};

export interface CreateClusterResponse {
  getLeastLoadedProcess: () => ChildProcess;
  killAll: () => void;
}

export type DataMessage = {
  message: 'done' | 'close';
  length: number;
};

export type Handler = CreateCluster;
