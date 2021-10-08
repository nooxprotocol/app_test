import { contractCategorySchema, IContractCategory } from "./model/contract_category.schema";
import { BaseRepository } from "./base_repo";

export class ContractCategoryRepository extends BaseRepository {
  constructor() {
    super("ContractCategory", contractCategorySchema);
  }

  public async initDB() {
    await this._initDB("./sample/contract_category.json", 100_000, "id");
  }
}