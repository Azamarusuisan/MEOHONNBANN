import Bull from 'bull';
import { config } from '../config/index';

// Queue definitions
export const postPublishQueue = new Bull('post-publish', config.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 60000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export const metricsFetchQueue = new Bull('metrics-fetch', config.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 30000,
    },
    removeOnComplete: 50,
    removeOnFail: 50,
  },
});

export const lineNotifyQueue = new Bull('line-notify', config.REDIS_URL, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

// Job data interfaces
export interface PostPublishJobData {
  scheduleId: string;
  postId: string;
  storeId: string;
  retryCount: number;
}

export interface MetricsFetchJobData {
  storeId: string;
  date: string;
}

export interface LineNotifyJobData {
  lineAccountId: string;
  templateType: 'POST_SUCCESS' | 'POST_FAILURE';
  recipientId?: string;
  variables: {
    storeName: string;
    postTitle: string;
    errorMessage?: string;
  };
}
