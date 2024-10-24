import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  @Inject(CACHE_MANAGER) private cacheManager: Cache;

  async setCacheKey({
    key: key,
    data: data,
    ttl = 60,
  }: {
    key: string | number;
    data: any;
    ttl?: number;
  }) {
    return await this.cacheManager.set(`${key}`, data, ttl);
  }

  async getCacheKey(key: string) {
    return await this.cacheManager.get(`${key}`);
  }

  async deleteCacheKey(key: string) {
    return await this.cacheManager.del(`${key}`);
  }
}
