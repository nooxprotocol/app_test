import type { Document } from "mongoose";
import { logger } from "../logger/winston";
import { BadgeRepository } from "../repository/badge.repo";
import { ContractRepository } from "../repository/contract.repo";
import { RawTransactionRepository } from "../repository/raw_transaction.repo";
import { UserTxActivityRepository } from "../repository/user_tx_activity.repo";


//비즈니스로직에서 특정유저의 활동에 대한 갱신을 수행한다.(Focus!)
export async function updateUserTxActivityDB(id: string) {
  const userTxActivityRepo = new UserTxActivityRepository();
  let user = await userTxActivityRepo.findDocByID(id);
  if (user == null) {
    user = await userTxActivityRepo.createUserActivity(id);
    logger.debug(`Create User: ${user}`);
  } else {
    logger.debug(`Already Exist ${id}`);
  }
  await _updateUserTxActivityDB(user);
  await user.save();
}

//Contract를 순회하여 해당하는 뱃지를 가져와 해당유저의 BadgeProgress를 갱신한다.
async function _updateUserTxActivityDB(user: Document) {
  const contractRepo = new ContractRepository();
  const badgeRepo = new BadgeRepository();

  const contracts: Array<Document> = await contractRepo.findContractDoc({});
  for (const i in contracts) {
    const contract: Document = contracts[i];
    const categoryIds: Array<Number> = contract["category"];
    const badges: Array<Document> = await badgeRepo.findDoc({category_id: { $in: categoryIds}});
    for (const j in badges) {
      const badge: Document = badges[j];
      await _updateBadgeProgress(user, contract, badge);
    }
  }
}

//뱃지에 기록된 sync_bh값을 기준으로 일정분량의 TX를 가져와 BadgeProgress를 갱신합니다.
//현재는 카운트만 계산하기때문에 txs.length만 사용.
async function _updateBadgeProgress(user: Document, contract: Document, badge: Document) {
  const rawTxRepo = new RawTransactionRepository();
  const userTxActivityRepo = new UserTxActivityRepository();

  //만약 DB에 없는 Badge라면 0번부터 N BH까지 Tx를 가져와 갱신한다.
  //BadgeProgress갱신로직
  const txs: Array<Document> = await rawTxRepo.findDoc({
    from_address: user.id, 
    to_address: contract.id
  });

  await user.updateOne({$addToSet: {"badges": {_id: badge["id"], type: badge["type"], value: txs.length}}})

  // const categoryIds: Array<Number> = contract["category"];
  // const badges: Array<Document> = await badgeRepo.findDoc({category_id: { $in: categoryIds}});
  // for (const j in badges) {
  //   const badge: Document = badges[j];
  //   //현재는 카운트만 계산하기때문에 txs.length만 사용.
  // }
}