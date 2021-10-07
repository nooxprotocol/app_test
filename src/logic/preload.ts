import type { Document } from "mongoose";
import { UserBadgeRepository } from "../repository/user_badge.repo";
import { logger } from "../logger/winston";
import { RawTransactionRepository } from "../repository/raw_transaction.repo";
import { UserTxActivityRepository } from "../repository/user_tx_activity.repo";
import { updateUserBadgeDB, updateUserTxActivityDB } from "./target_user";

//백단에서 전체유저의 활동에 대한 갱산을 수행한다.
export async function preloadUserTxActivityDB() {
  const rawTxRepo = new RawTransactionRepository();
  const userTxActivityRepo = new UserTxActivityRepository();

  //1. FromAddress를 모두 구한다.
  //2. 순회하면서 UserActivity를 갱신한다.
  //2-1. 새로생긴 유저라면 UserTxActivity Doc를 추가한다.
  const ids: Array<string> = await rawTxRepo.getFromList();

  const bulkSize: number = 10;
  const loopSize: number = Math.floor(ids.length / bulkSize) + 1;

  for (let i = 0; i < loopSize; ++i) {
    const tmp = ids.splice(0, bulkSize);
    const users: Array<Document> = [];
  
    for (const index in tmp) {
      const id: string = tmp[index];
      const user: Document = await updateUserTxActivityDB(id);
      users.push(user);
      logger.debug(`count: ${users.length}`)
    }
    logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
    await userTxActivityRepo.bulkSave(users);
  }
}

//백단에서 전체유저의 활동에 대한 갱산을 수행한다.
export async function preloadUserBadgeDB() {
  const rawTxRepo = new RawTransactionRepository();
  const userBadgeRepo = new UserBadgeRepository();

  //1. FromAddress를 모두 구한다.
  //2. 순회하면서 UserBadge를 갱신한다.
  //2-1. 새로생긴 유저라면 UserBadge Doc를 추가한다.
  const ids: Array<string> = await rawTxRepo.getFromList();

  const bulkSize: number = 10;
  const loopSize: number = Math.floor(ids.length / bulkSize) + 1;

  for (let i = 0; i < loopSize; ++i) {
    const tmp = ids.splice(0, bulkSize);
    const users: Array<Document> = [];
  
    for (const index in tmp) {
      const id: string = tmp[index];
      const user: Document = await updateUserBadgeDB(id);
      users.push(user);
      logger.debug(`count: ${users.length}`)
    }
    logger.debug(`i: ${i}, tmp.length: ${tmp.length}`)
    await userBadgeRepo.bulkSave(users);
  }
}