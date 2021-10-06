import type { Document } from "mongoose";
import { logger } from "src/logger/winston";
import { RawTransactionRepository } from "src/repository/raw_transaction.repo";
import { UserTxActivityRepository } from "src/repository/user_tx_activity.repo";

//백단에서 전체유저의 활동에 대한 갱산을 수행한다.
//TODO
export async function initAllUserTxActivityDB() {
  const rawTxRepo = new RawTransactionRepository();
  const userTxActivityRepo = new UserTxActivityRepository();

  //1. FromAddress를 모두 구한다.
  //2. 순회하면서 UserActivity를 갱신한다.
  //2-1. 새로생긴 유저라면 UserTxActivity Doc를 추가한다.
  const ids: Array<string> = await rawTxRepo.getFromList();
  const users: Array<Document> = [];
  for (const index in ids) {
    const id: string = ids[index];
    let user = await userTxActivityRepo.findDocByID(id);
    if (user == null) {
      user = await userTxActivityRepo.createUserActivity(id);
      logger.debug(`Create User: ${user}`);
    } else {
      logger.debug(`Already Exist ${id}`);
    }
    //await updateUserTxActivityDB(user);
    users.push(user);
  }
  await userTxActivityRepo.bulkSave(users);
}