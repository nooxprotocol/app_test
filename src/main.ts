import { dbConnector } from "./db_connector";
import { logger } from "./logger/winston";
import { updateUserTxActivityDB } from "./logic/target_user";

async function main() {
  logger.debug("Start!");
  //1. 필요한 DB를 세팅합니다.
  //- Predefined BadgeDB
  //- Predefined ContractDB
  //- Get RawTransactionDB
  //await initDB();
  const user: string = "0x00000000009a41862f3b2b0c688b7c0d1940511e";
  await updateUserTxActivityDB(user);

  logger.debug("Done!");
  dbConnector.close();
}

main();