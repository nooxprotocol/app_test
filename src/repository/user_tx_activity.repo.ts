import type{ Document, Model } from "mongoose";
import { dbConnector } from "../db_connector";
import { logger } from "../logger/winston";
import { userTxActivitySchema } from "../model/user_tx_activity.schema";

export class UserTxActivityRepository {
  private readonly _model: Model<unknown>;
  constructor() {
    this._model = dbConnector.connection.model('UserTxActivity', userTxActivitySchema);
  }

  public async findDoc(query: Record<string, any>, fields?: Record<string, any>): Promise<Array<Document>> {
    return await this._model.find(query, fields);
  }

  public async findDocByID(id: string): Promise<Document> {
    return await this._model.findById(id);
  }

  public async createUserActivity(id: string): Promise<Document> {
    return new this._model({_id: id});
  }

  public async bulkSave(docs: Array<Document>){
    await this._model.bulkSave(docs);
  }
}