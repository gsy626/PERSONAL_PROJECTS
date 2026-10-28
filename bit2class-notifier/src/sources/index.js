import { HttpJsonSource } from './http-json.js';
import { MockSource } from './mock.js';

export function createSource(config) {
  switch (config.source) {
    case 'mock':
      return new MockSource(config);
    case 'http':
      return new HttpJsonSource(config);
    default:
      throw new Error(`未知数据源 SOURCE=${config.source}，可选：mock / http`);
  }
}
