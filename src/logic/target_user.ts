import { Document } from "mongoose";
import { BadgeRepository } from "../repository/badge.repo";
import { ContractRepository } from "../repository/contract.repo";
import { RawTransactionRepository } from "../repository/raw_transaction.repo";
import { UserTxActivityRepository } from "../repository/user_tx_activity.repo";
import { logger } from "../logger/winston";
import { UserBadgeRepository } from "src/repository/user_badge.repo";


//비즈니스로직에서 특정유저의 활동에 대한 갱신을 수행한다.(Focus!)
export async function updateUserTxActivityDB(id: string): Promise<Document> {
  const userTxActivityRepo = new UserTxActivityRepository();
  let user = await userTxActivityRepo.findDocByID(id);
  if (user == null) {
    user = await userTxActivityRepo.createUserActivity(id);
    logger.debug(`Create User: ${user}`);
  } else {
    logger.debug(`Already Exist ${id}`);
  }
  await _updateUserTxActivityDB(user);
  return user;
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
    logger.debug(`Badges: ${badges}, CategoryIds: ${categoryIds}`);
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

  const obj = user["badges"].id(badge._id);
  logger.debug(`badgeProgress: ${obj}, ${badge._id}`);
  //만약 DB에 없는 Badge라면 0번부터 N BH까지 Tx를 가져와 갱신한다.
  //BadgeProgress갱신로직
  if (obj == null) {
    const initBlockBH: number = 20000000;
    const txs: Array<Document> = await rawTxRepo.findDoc({
      from_address: user.id, 
      to_address: contract.id,
      block_number: {$lte: initBlockBH}
    });
    user["badges"].push({_id: badge["id"], type: badge["type"], value: txs.length, sync_bh: initBlockBH});
  } else {
    const rangeBH: number = 0;
    const stBH: number = user["badges"].id(badge._id)["sync_bh"];
    const edBH: number = stBH + rangeBH;
    
    const txs: Array<Document> = await rawTxRepo.findDoc({
      from_address: user.id, 
      to_address: contract.id,
      block_number: {$gt: stBH, $lte: edBH}
    });
    
    const oValue = user["badges"].id(badge._id)["value"];
    const prevValue: number = parseInt(oValue);
    let dst: number = prevValue + txs.length;
    user["badges"].id(badge._id)["value"] = dst.toString();
    user["badges"].id(badge._id)["sync_bh"] = edBH;
  }
}



//비즈니스로직에서 특정유저의 뱃지에 대한 갱신을 수행한다.
//TODO
export async function updateUserBadgeDB(id: string): Promise<Document> {
  const userBadgeRepo = new UserBadgeRepository();
  let user = await userBadgeRepo.findDocByID(id);
  if (user == null) {
    user = await userBadgeRepo.createUserBadge(id);
    logger.debug(`Create User: ${user}`);
  } else {
    logger.debug(`Already Exist ${id}`);
  }
  await _updateUserBadgeDB(user);
  return user;
}


//Contract를 순회하여 해당하는 뱃지를 가져와 해당유저의 BadgeAcquire를 갱신한다.
async function _updateUserBadgeDB(user: Document) {
  const contractRepo = new ContractRepository();
  const badgeRepo = new BadgeRepository();

  const contracts: Array<Document> = await contractRepo.findContractDoc({});
  for (const i in contracts) {
    const contract: Document = contracts[i];
    const categoryIds: Array<Number> = contract["category"];
    const badges: Array<Document> = await badgeRepo.findDoc({category_id: { $in: categoryIds}});
    logger.debug(`Badges: ${badges}, CategoryIds: ${categoryIds}`);
    for (const j in badges) {
      const badge: Document = badges[j];
      await _updateBadgeAcquire(user, contract, badge);
    }
  }
}

//TXActivityDB에 기록된 value값을 기준으로 BadgeAcquire를 갱신합니다.
async function _updateBadgeAcquire(user: Document, contract: Document, badge: Document) {
  const userTxActivityRepo = new UserTxActivityRepository();

  const obj = user["badges"].id(badge._id);
  logger.debug(`badgeAcuire: ${obj}, ${badge._id}`);
  //BadgeAcquire갱신로직
  if (obj == null) {
    const userTxActivityDoc = userTxActivityRepo.findDocByID(user.id);
    //COUNT일때는 number처리
    const srcValue: number = userTxActivityDoc["badges"].id(badge.id)["value"];
    const isAcquire: boolean = srcValue > badge["target_value"];
    user["badges"].push({_id: badge["id"], acuire: isAcquire, visible: true});
  } else {
    
    let isAcquire: boolean = user["badges"].id(badge._id)["acquire"];
    if (isAcquire == true) {
      return;
    }

    const userTxActivityDoc = userTxActivityRepo.findDocByID(user.id);
    //COUNT일때는 number처리
    const srcValue: number = userTxActivityDoc["badges"].id(badge.id)["value"];
    isAcquire = srcValue > badge["target_value"];
    user["badges"].id(badge._id)["acquire"] = isAcquire;
  }
}