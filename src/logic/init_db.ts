import { BadgeRepository } from "src/repository/badge.repo";
import { ContractRepository } from "src/repository/contract.repo";
import { RawTransactionRepository } from "src/repository/raw_transaction.repo";


//한계점: BH범위에 대하여 대응 해야하나, 현재는 무조건 전체검색
export async function initDB() {
  const rawTxRepo = new RawTransactionRepository();
  const contractRepo = new ContractRepository();
  const badgeRepo = new BadgeRepository();
  await rawTxRepo.initDb();
  await contractRepo.initDb();
  await badgeRepo.initDb()
}