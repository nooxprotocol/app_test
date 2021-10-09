// import type { Document } from 'mongoose';
// import { UserBadgeRepository } from '../repository/user_badge.repo';
// import { logger } from '../logger/winston';
// import { RawTransactionRepository } from '../repository/raw_transaction.repo';
// import { UserBadgeProgressRepository } from '../repository/user_badge_progress.repo';
// import { updateUserBadgeDB, updateUserBadgeProgressDB } from './target_user';

// //백단에서 전체유저의 활동에 대한 갱산을 수행한다.
// export async function preloadUserBadgeProgressDB() {
//   const rawTxRepo = new RawTransactionRepository();
//   const userBadgeProgressRepo = new UserBadgeProgressRepository();

//   //1. FromAddress를 모두 구한다.
//   //2. 순회하면서 UserBadgeProgress를 갱신한다.
//   //2-1. 새로생긴 유저라면 UserBadgeProgress Doc를 추가한다.
//   const ids: Array<string> = await rawTxRepo.getFromList();

//   const bulkSize = 10;
//   const loopSize: number = Math.floor(ids.length / bulkSize) + 1;

//   for (let i = 0; i < loopSize; ++i) {
//     const tmp = ids.splice(0, bulkSize);
//     const users: Array<Document> = [];

//     for (const index in tmp) {
//       const id: string = tmp[index];
//       const user: Document = await updateUserBadgeProgressDB(id);
//       users.push(user);
//       logger.debug(`count: ${users.length}`);
//     }
//     logger.debug(`i: ${i}, tmp.length: ${tmp.length}`);
//     await userBadgeProgressRepo.bulkSave(users);
//   }
// }

// //백단에서 전체유저의 활동에 대한 갱산을 수행한다.
// export async function preloadUserBadgeDB() {
//   const rawTxRepo = new RawTransactionRepository();
//   const userBadgeRepo = new UserBadgeRepository();

//   //1. FromAddress를 모두 구한다.
//   //2. 순회하면서 UserBadge를 갱신한다.
//   //2-1. 새로생긴 유저라면 UserBadge Doc를 추가한다.
//   const ids: Array<string> = await rawTxRepo.getFromList();

//   const bulkSize = 10;
//   const loopSize: number = Math.floor(ids.length / bulkSize) + 1;

//   for (let i = 0; i < loopSize; ++i) {
//     const tmp = ids.splice(0, bulkSize);
//     const users: Array<Document> = [];

//     for (const index in tmp) {
//       const id: string = tmp[index];
//       const user: Document = await updateUserBadgeDB(id);
//       users.push(user);
//       logger.debug(`count: ${users.length}`);
//     }
//     logger.debug(`i: ${i}, tmp.length: ${tmp.length}`);
//     await userBadgeRepo.bulkSave(users);
//   }
// }
