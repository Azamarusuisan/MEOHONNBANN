import { config } from '../config/index';
import { IGbpService } from './gbp/gbp.interface';
import { GbpMockService } from './gbp/gbp-mock.service';
import { ILineNotificationService } from './line/line.interface';
import { LineMockService } from './line/line-mock.service';

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
