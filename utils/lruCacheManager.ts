import { LRUCache } from "lru-cache";
import { Connection } from "mongoose";

interface CacheOptions {
  max: number;
  maxAge: number;
}

const cacheOptions: CacheOptions = {
  max: 5000,
  maxAge: 1000 * 60 * 60,
};

const connectionCache = new LRUCache<string, Connection>(cacheOptions);

const setCacheConnection = (tenantId: string, dbConn: Connection): void => {
  console.log("Setting connection cache for ", tenantId);
  connectionCache.set(tenantId, dbConn);
};

const getCacheConnection = (tenantId: string): Connection | undefined => {
  return connectionCache.get(tenantId);
};

const getCacheValuesArr = (): Connection[] => {
  return Array.from(connectionCache.values());
};

export { setCacheConnection, getCacheConnection, getCacheValuesArr };
