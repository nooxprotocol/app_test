import { IUserBadgeProgress, userBadgeProgressSchema } from "./model/user_badge_progress.schema";
import { BaseRepository } from "./base_repo";

export class UserBadgeProgressRepository extends BaseRepository {
  constructor() {
    super("UserBadgeProgress", userBadgeProgressSchema);
  }

  public async createDocument(id: string): Promise<any> {
    return await this._model.create({_id: id});
  }

  public async bulkSave(docs: Array<any>){
    await this._model.bulkSave(docs);
  }
}