import { Model, Schema } from "mongoose";
import { logger } from "../logger/winston";
import { dbConnector } from "../db_connector";
import { sampleFileLoader } from "../sample_file_loader";

export abstract class BaseRepository {
  protected readonly _model: Model<any>;
  constructor(modelName: string, schema: Schema) {
    this._model = dbConnector.connection.model(modelName, schema);
  }

  get model(): Model<any> {
    return this._model;
  }

  protected async _initDB(path: string, bulkSize: number, idKey: string) {
    const arr: Array<Record<string, any>>= await sampleFileLoader(path);
    const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

    for (let i = 0; i < loopSize; ++i) {
      const tmp = arr.splice(0, bulkSize);
      const models = [];
      for (const index in tmp) {
        const data = tmp[index];
        data["_id"] = data[idKey];
        //logger.debug(data);
        const model = new this._model(data);
        models.push(model);
      }
      logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
      await this._model.bulkSave(models);
    }
  }
}