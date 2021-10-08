import { contractSchema, IContract } from "./model/contract.schema";
import { BaseRepository } from "./base_repo";
export class ContractRepository extends BaseRepository {
  constructor() {
    super("Contract", contractSchema);
  }

  public async initDB() {
    await this._initDB("./sample/contract.json", 100_000, "address");
  }
}