import { IUserBadge, userBadgeSchema } from "./model/user_badge.schema";
import { BaseRepository } from "./base_repo";

export class UserBadgeRepository extends BaseRepository {
  constructor() {
    super("UserBadge", userBadgeSchema);
  }

  public async createDocument(id: string): Promise<any> {
    return new this._model({_id: id});
  }

  public async bulkSave(docs: Array<any>){
    await this._model.bulkSave(docs);
  }
}