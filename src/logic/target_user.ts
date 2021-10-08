import { BadgeRepository } from "../repository/badge.repo";
import { ContractRepository } from "../repository/contract.repo";
import { RawTransactionRepository } from "../repository/raw_transaction.repo";
import { UserBadgeProgressRepository } from "../repository/user_badge_progress.repo";
import { UserBadgeRepository } from "../repository/user_badge.repo";
import { logger } from "../logger/winston";
import { Document } from "mongoose";
import { IBadge } from "src/repository/model/badge.schema";


//비즈니스로직에서 특정유저의 활동에 대한 갱신을 수행한다.(Focus!)
export async function updateUserBadgeProgressDB(id: string): Promise<Document> {
  const userBadgeProgressRepo = new UserBadgeProgressRepository();
  let user = await userBadgeProgressRepo.model.findById(id);
  if (user == null) {
    user = await userBadgeProgressRepo.createDocument(id);
    logger.debug(`Create User: ${user}`);
  } else {
    logger.debug(`Already Exist ${id}`);
  }
  await _updateUserBadgeProgressDB(user);
  return user;
}

//Contract를 순회하여 해당하는 뱃지를 가져와 해당유저의 BadgeProgress를 갱신한다.
async function _updateUserBadgeProgressDB(user: Document) {
  const contractRepo = new ContractRepository();
  const badgeRepo = new BadgeRepository();
  const rawTxRepo = new RawTransactionRepository();

  const initBlockBH: number = 10_000_000;
  let srcIndex: number = 0
  let dstIndex: number = initBlockBH
  const maxIndex: number = 20_000_000;

  const contracts = await contractRepo.model.find({});
  for (const contract of contracts) {
    let srcIndex: number = 0
    let dstIndex: number = initBlockBH
    while (srcIndex != dstIndex) {
      const docs = await rawTxRepo.model.find({
        from_address: user.id, 
        to_address: contract.id,
        block_number: {$gte: srcIndex, $lt: dstIndex}
      }, {_id: 1});
      const txs: Array<string> = docs.map(x => x.id);
      logger.debug(`Txs) txs: ${txs.length}, srcIndex: ${srcIndex}, dstIndex: ${dstIndex}, from: ${user.id}, to: ${contract.id}`);

      const badges = await badgeRepo.model.find({category_id: { $in: contract.category}});
      for (const j in badges) {
        await _updateBadgeProgress(user, contract, badges[j], txs, srcIndex, dstIndex);
      }

      srcIndex += initBlockBH;
      dstIndex += initBlockBH;
      if (srcIndex > maxIndex) {
        srcIndex = maxIndex;
      }
      if (dstIndex > maxIndex) {
        dstIndex = maxIndex;
      }
    }
  }
}

//뱃지에 기록된 sync_bh값을 기준으로 일정분량의 TX를 가져와 BadgeProgress를 갱신합니다.
//현재는 카운트만 계산하기때문에 txs.length만 사용.
async function _updateBadgeProgress(user: Document, contract: Document, badge: Document, txIds: Array<string>, srcIndex: number, dstIndex: number) {
  const rawTxRepo = new RawTransactionRepository();

  const obj = user["badges"].id(badge.id);
  logger.debug(`badgeProgress: ${obj}, ${badge.id}`);
  //BadgeProgress갱신로직
  const txs: Array<Document> = await rawTxRepo.model.find({
    _id: {$in: txIds}, 
    block_number: {$gte: srcIndex, $lt: dstIndex}
  });
  if (obj == null) {
    user["badges"].push({_id: badge.id, type: badge["type"], value: String(txs.length), sync_bh: dstIndex});
  } else {
    let sync_bh: number = user["badges"].id(badge.id).sync_bh;
    if (sync_bh > dstIndex) {
      return;
    }
    
    const oValue = user["badges"].id(badge.id)["value"];
    const prevValue: number = parseInt(oValue);
    let dst: number = prevValue + txs.length;
    user["badges"].id(badge.id)["value"] = dst.toString();
    user["badges"].id(badge.id)["sync_bh"] = dstIndex;
  }
}

//비즈니스로직에서 특정유저의 뱃지에 대한 갱신을 수행한다.
//TODO
export async function updateUserBadgeDB(id: string): Promise<Document> {
  const userBadgeRepo = new UserBadgeRepository();
  let user = await userBadgeRepo.model.findById(id);
  if (user == null) {
    user = await userBadgeRepo.createDocument(id);
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

  const contracts = await contractRepo.model.find({});
  for (const contract of contracts) {
    const categoryIds: Array<Number> = contract["category"];
    const badges = await badgeRepo.model.find(
      {category_id: { $in: categoryIds}}
    );
    logger.debug(`Badges: ${badges.length}`)
    for (const badge of badges) {
      //logger.debug(`Badge: ${badge}`)
      await _updateBadgeAcquire(user, contract, badge);
    }
  }
}

//BadgeProgressDB에 기록된 value값을 기준으로 BadgeAcquire를 갱신합니다.
async function _updateBadgeAcquire(user: Document, contract: Document, badge: Document) {
  const userBadgeProgressRepo = new UserBadgeProgressRepository();

  const obj = user["badges"].id(badge.id);
  logger.debug(`BadgeAcuire: ${obj}, ${badge.id}, ${user.id}`);
  //BadgeAcquire갱신로직
  if (obj == null) {
    const doc: Document = await userBadgeProgressRepo.model.findById(user.id);
    if (doc == null) {
      return;
    }
    
    //COUNT일때는 number처리
    const srcValue: number = doc["badges"].id(badge.id)["value"];
    const isAcquire: boolean = srcValue > badge["value"];
    user["badges"].push({_id: badge.id, acquire: isAcquire, visible: true});
  } else {
    let isAcquire: boolean = user["badges"].id(badge.id)["acquire"];
    if (isAcquire == true) {
      return;
    }
    const doc = await userBadgeProgressRepo.model.findById(user.id);
    //COUNT일때는 number처리
    const srcValue: number = doc["badges"].id(badge.id)["value"];
    isAcquire = srcValue > badge["value"];
    user["badges"].id(badge.id)["acquire"] = isAcquire;
  }
}