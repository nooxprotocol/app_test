import type{ Document, Model } from "mongoose";
import { dbConnector } from "../db_connector";
import { logger } from "../logger/winston";
import { badgeSchema } from "../model/badge.schema";
import { sampleFileLoader } from "../sample_file_loader";

export class BadgeRepository {
  private readonly _model: Model<unknown>;
  constructor() {
    this._model = dbConnector.connection.model('Badge', badgeSchema);
  }

  public async initDb() {
    const arr: Array<Record<string, any>>= await sampleFileLoader("./sample/badge.json");
    const bulkSize: number = 100000;
    const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

    for (let i = 0; i < loopSize; ++i) {
      const tmp = arr.splice(0, bulkSize);
      const models = [];
      for (const index in tmp) {
        const data = tmp[index];
        data["_id"] = data["id"];
        logger.debug(data);
        const model = new this._model(data);
        models.push(model);
      }
      logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
      await this._model.bulkSave(models);
    }
  }

  // public async getAllEOAList() {
  //   const docs = await this._model.distinct("from_address");
  //   logger.debug(docs);
  // }

  // public async aggregate() {
  //   const docs = await this._model.aggregate([
  //     {
  //       $group: {
  //         _id: "$from_address",
  //         count: { $sum: 1 }
  //       },
  //     },
  //     { $project : { from_address : 1 } }
  //   ]);
  //   logger.debug(docs);
  // }

  public async findDoc(query: Record<string, any>, fields?: Record<string, any>): Promise<Array<Document>> {
    return await this._model.find(query, fields);
  }
}