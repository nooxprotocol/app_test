import { MONGO_ENV } from "./const";
import { logger } from "./logger/winston";
import type {ConnectOptions, Connection} from "mongoose";
import {createConnection} from "mongoose";

class DBConnector {
  private readonly _connection: Connection;

  constructor() {
    const dbUrl: string = `mongodb://${MONGO_ENV.host}:${MONGO_ENV.port}/${MONGO_ENV.db}`;
    const option: ConnectOptions = {
      dbName: MONGO_ENV.db,
      auth: {
        username: MONGO_ENV.username,
        password: MONGO_ENV.password
      }
    }

    logger.debug(`${dbUrl}, ${JSON.stringify(option)}`);
    this._connection = createConnection(dbUrl, option);
  }

  get connection(): Connection {
    return this._connection;
  }

  public async close() {
    this._connection.close();
  }
}

export const dbConnector = new DBConnector();
