import type { ConnectOptions } from 'mongoose';
import { MONGO_ENV } from '../const';

export const url = `mongodb://${MONGO_ENV.host}:${MONGO_ENV.port}/${MONGO_ENV.db}`;
export const option: ConnectOptions = {
  dbName: MONGO_ENV.db,
  auth: {
    username: MONGO_ENV.username,
    password: MONGO_ENV.password,
  },
};
