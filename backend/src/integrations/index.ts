import { config } from '../config/index.js';
import { IGbpService } from './gbp/gbp.interface.js';
import { GbpMockService } from './gbp/gbp-mock.service.js';
import { ILineNotificationService } from './line/line.interface.js';
import { LineMockService } from './line/line-mock.service.js';

export function createGbpService(): IGbpService {
  if (config.USE_MOCK_SERVICES) {
    return new GbpMockService();
  }
  // Phase 2: return new GbpRealService();
  return new GbpMockService();
}

export function createLineService(): ILineNotificationService {
  if (config.USE_MOCK_SERVICES) {
    return new LineMockService();
  }
  // Phase 2: return new LineRealService();
  return new LineMockService();
}

export const gbpService = createGbpService();
export const lineService = createLineService();
