import type{ Document, Model } from "mongoose";
import { dbConnector } from "../db_connector";
import { logger } from "../logger/winston";
import { userBadgeSchema } from "../model/user_badge.schema";

export class UserBadgeRepository {
  private readonly _model: Model<unknown>;
  constructor() {
    this._model = dbConnector.connection.model('UserBadge', userBadgeSchema);
  }

  get model(): Model<unknown> {
    return this._model;
  }

  public async findDoc(query: Record<string, any>, fields?: Record<string, any>): Promise<Array<Document>> {
    return await this._model.find(query, fields);
  }

  public async findDocByID(id: string): Promise<Document> {
    return await this._model.findById(id);
  }

  public async createUserBadge(id: string): Promise<Document> {
    return new this._model({_id: id});
  }

  public async bulkSave(docs: Array<Document>){
    await this._model.bulkSave(docs);
  }
}