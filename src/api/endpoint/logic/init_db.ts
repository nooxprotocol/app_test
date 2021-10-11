import { Model } from 'mongoose';
import { logger } from 'src/logger/winston';
import { getFileList, sampleFileLoader } from 'src/sample_file_loader';

// //한계점: BH범위에 대하여 대응 해야하나, 현재는 무조건 전체검색
// //- Predefined BadgeDB
// //- Predefined ContractDB
// //- Predefined ContractCategoryDB
// //- Get RawTransactionDB

export async function initDB(
  model: Model<Document>,
  path: string,
  bulkSize: number,
  idKey: string,
) {
  const arr: Array<Record<string, any>> = await sampleFileLoader(path);
  const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

  for (let i = 0; i < loopSize; ++i) {
    const tmp = arr.splice(0, bulkSize);
    const models = [];
    for (const index in tmp) {
      const data = tmp[index];
      data['_id'] = data[idKey];
      //logger.debug(data);
      models.push(new model(data));
    }
    logger.debug(`i: ${i}, tmp.length: ${tmp.length}`);
    await model.bulkSave(models);
  }
}

export async function initDirDB(
  model: Model<Document>,
  dirPath: string,
  bulkSize: number,
  idKey: string,
) {
  const list = await getFileList(dirPath);
  for (const index in list) {
    const path: string = list[index];
    const arr: Array<Record<string, any>> = await sampleFileLoader(
      `${dirPath}/${path}`,
    );
    const loopSize: number = Math.floor(arr.length / bulkSize) + 1;

    for (let i = 0; i < loopSize; ++i) {
      const tmp = arr.splice(0, bulkSize);
      const models = [];
      for (const index in tmp) {
        const data = tmp[index];
        data['_id'] = data[idKey];
        //logger.debug(data);
        models.push(new model(data));
      }
      logger.debug(`i: ${i}, tmp.length: ${tmp.length}`);
      await model.bulkSave(models);
    }
  }
}
