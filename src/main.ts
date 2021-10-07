import type { Document } from "mongoose";
import { dbConnector } from "./db_connector";
import { logger } from "./logger/winston";
import { preloadUserBadgeDB, preloadUserTxActivityDB } from "./logic/preload";
import { updateUserBadgeDB, updateUserTxActivityDB } from "./logic/target_user";

const IS_PRELOAD: boolean = true;

async function main() {
  logger.debug("Start!");
  //1. 필요한 DB를 세팅합니다.
  //- Predefined BadgeDB
  //- Predefined ContractDB
  //- Get RawTransactionDB
  //await initDB();

  //2. UserActivityDB갱신
  //await UserTxActivityDB("0x00000000009a41862f3b2b0c688b7c0d1940511e");

  //3. 세팅된 UserActivityDB를 이용하여 UserBadge를 갱신합니다.
  await UserBadgeDB("0x00000000009a41862f3b2b0c688b7c0d1940511e");

  logger.debug("Done!");
  dbConnector.close();
}

async function UserTxActivityDB(userId: string) {
  if (IS_PRELOAD) {
    //2-1. TXDB에서 EOA를 추출하여 활동DB를 갱신합니다.
    await preloadUserTxActivityDB();
  } else {
    // // //2-2. 특정 유저에 대하여 활동DB를 갱신합니다.
    const user: Document = await updateUserTxActivityDB(userId);
    await user.save();
  }
}

async function UserBadgeDB(userId: string) {
  if (IS_PRELOAD) {
    //2-1. TXDB에서 EOA를 추출하여 뱃지DB를 갱신합니다.
    await preloadUserBadgeDB();
  } else {
    //3-2
    const user: Document = await updateUserBadgeDB(userId);
    await user.save();
  }
}

main();