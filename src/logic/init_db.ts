import { ContractCategoryRepository } from "../repository/contract_category.repo";
import { BadgeRepository } from "../repository/badge.repo";
import { ContractRepository } from "../repository/contract.repo";
import { RawTransactionRepository } from "../repository/raw_transaction.repo";


//한계점: BH범위에 대하여 대응 해야하나, 현재는 무조건 전체검색
//- Predefined BadgeDB
//- Predefined ContractDB
//- Predefined ContractCategoryDB
//- Get RawTransactionDB
export async function initDB() {
  const rawTxRepo = new RawTransactionRepository();
  await rawTxRepo.initDB();

  const contractRepo = new ContractRepository();
  await contractRepo.initDB();
  
  const contractCategoryRepo = new ContractCategoryRepository();
  await contractCategoryRepo.initDB();

  const badgeRepo = new BadgeRepository();
  await badgeRepo.initDB()
  
  
}