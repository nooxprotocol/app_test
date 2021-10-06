import { Document } from "mongoose";
import type{ Model } from "mongoose";
import { dbConnector } from "../db_connector";
import { logger } from "../logger/winston";
import { contractSchema, contractCategorySchema } from "../model/contract.schema";
import { sampleFileLoader } from "../sample_file_loader";

export class ContractRepository {
  private readonly _contractModel: Model<unknown>;
  private readonly _contractCategoryModel: Model<unknown>;
  constructor() {
    this._contractModel = dbConnector.connection.model('Contract', contractSchema);
    this._contractCategoryModel = dbConnector.connection.model('ContractCategory', contractCategorySchema);
  }

  public async initDb() {
    await this._initContractDb();
    await this._initCategoryDb();
  }

  private async _initContractDb() {
    const arr: Array<Record<string, any>>= await sampleFileLoader("./sample/contract.json");
    const bulkSize: number = 100000;
    const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

    for (let i = 0; i < loopSize; ++i) {
      const tmp = arr.splice(0, bulkSize);
      const models = [];
      for (const index in tmp) {
        const data = tmp[index];
        data["_id"] = data["address"];
        //logger.debug(data);
        const model = new this._contractModel(data);
        models.push(model);
      }
      logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
      await this._contractModel.bulkSave(models);
    }
  }

  private async _initCategoryDb() {
    const arr: Array<Record<string, any>>= await sampleFileLoader("./sample/contract_category.json");
    const bulkSize: number = 100000;
    const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

    for (let i = 0; i < loopSize; ++i) {
      const tmp = arr.splice(0, bulkSize);
      const models = [];
      for (const index in tmp) {
        const data = tmp[index];
        data["_id"] = data["id"];
        //logger.debug(data);
        const model = new this._contractCategoryModel(data);
        models.push(model);
      }
      logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
      await this._contractCategoryModel.bulkSave(models);
    }
  }

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

  public async findContractDoc(query: Record<string, any>, fields?: Record<string, any>): Promise<Array<Document>> {
    return await this._contractModel.find(query, fields);
  }

  public async findContractCategoryDoc(query: Record<string, any>, fields?: Record<string, any>): Promise<Array<Document>> {
    return await this._contractCategoryModel.find(query, fields);
  }
}