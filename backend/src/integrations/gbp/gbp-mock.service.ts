import { IGbpService, GbpPostData, GbpPostResult, GbpMetrics } from './gbp.interface';
import { logger } from '../../utils/logger';

export class GbpMockService implements IGbpService {
  async createPost(locationId: string, data: GbpPostData): Promise<GbpPostResult> {
    logger.info('[MOCK] GBP createPost called', { locationId, data });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 10% chance of failure for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Mock: Random failure for testing',
      };
    }

    return {
      success: true,
      postId: `mock-post-${Date.now()}`,
    };
  }

  async deletePost(locationId: string, postId: string): Promise<boolean> {
    logger.info('[MOCK] GBP deletePost called', { locationId, postId });
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }

  async getMetrics(locationId: string, date: Date): Promise<GbpMetrics> {
    logger.info('[MOCK] GBP getMetrics called', { locationId, date });
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Generate random mock data
    return {
      viewCount: Math.floor(Math.random() * 1000),
      searchCount: Math.floor(Math.random() * 500),
      phoneClicks: Math.floor(Math.random() * 50),
      directionClicks: Math.floor(Math.random() * 100),
      websiteClicks: Math.floor(Math.random() * 200),
    };
  }
}
