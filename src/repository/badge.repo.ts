import { badgeSchema, IBadge } from "../repository/model/badge.schema";
import { BaseRepository } from "./base_repo";

export class BadgeRepository extends BaseRepository {
  constructor() {
    super("Badge", badgeSchema);
  }

  public async initDB() {
    await this._initDB("./sample/badge.json", 100_000, "id");
  }
}