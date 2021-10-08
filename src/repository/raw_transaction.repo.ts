import { logger } from "../logger/winston";
import { rawTransactionSchema, IRawTransaction } from "./model/raw_transaction.schema";
import { BaseRepository } from "./base_repo";

export class RawTransactionRepository extends BaseRepository {
  constructor() {
    super("RawTransaction", rawTransactionSchema);
  }

  public async initDB() {
    for (let i=0; i<5; i++) {
      await this._initDB(`./sample/transaction/transaction_${i}.json`, 100_000, "hash");
    }
  }

  public async getFromList(): Promise<Array<string>> {
    const doc = await this._model.aggregate([{$group: {_id: "$from_address"}}]);
    var result = doc.map(x => x._id);
    return result;
  }

  //호출 많이 받는 순으로 to_address 조회
  public async debugAggregatePrt() {
    const docs = await this._model.aggregate([
      {
        $group: {
          _id: "$to_address",
          count: { $sum: 1 }
        },
      },
      { $project : { from_address : 1 } }
    ]);
    logger.debug(docs);
  }
}