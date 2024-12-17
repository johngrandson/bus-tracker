import { DataMessage } from '@/worker/types';

process.on('message', (data: any[]) => {
  if (!process.send) return;
  process.send({ message: 'done', length: data.length } as DataMessage);
});
