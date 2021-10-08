import type { Document } from "mongoose";
import { dbConnector } from "./db_connector";
import { logger } from "./logger/winston";
import { initDB } from "./logic/init_db";
import { preloadUserBadgeDB, preloadUserBadgeProgressDB } from "./logic/preload";
import { updateUserBadgeDB, updateUserBadgeProgressDB } from "./logic/target_user";

const IS_PRELOAD: boolean = false;

async function main() {
  logger.debug("Start!");
  //1. 필요한 DB를 세팅합니다.
  //await initDB();

  //2. UserBadgeProgressDB갱신
  //await UserBadgeProgressDB("0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be");

  //3. 세팅된 UserBadgeProgressDB를 이용하여 UserBadge를 갱신합니다.
  await UserBadgeDB("0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be");

  logger.debug("Done!");
  dbConnector.close();
}

async function UserBadgeProgressDB(userId: string) {
  if (IS_PRELOAD) {
    //2-1. TXDB에서 EOA를 추출하여 활동DB를 갱신합니다.
    await preloadUserBadgeProgressDB();
  } else {
    // // //2-2. 특정 유저에 대하여 활동DB를 갱신합니다.
    const user: Document = await updateUserBadgeProgressDB(userId);
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