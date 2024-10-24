import { CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const config: CacheModuleOptions = {
  store: redisStore,
  host: `127.0.0.1`,
  port: 6379,
  auth_pass: `rahasia`,
};
