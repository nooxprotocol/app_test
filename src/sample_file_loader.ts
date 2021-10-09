import * as fs from 'fs';
import * as ndjson from 'ndjson';
import { logger } from './logger/winston';

const TAG = 'sampleFileLoader';
export async function sampleFileLoader(
  path: string,
): Promise<Array<Record<string, any>>> {
  return await new Promise((resolve, reject) => {
    logger.debug(`[${TAG}] path: ${path}`);
    const items: Array<Record<string, any>> = [];
    const fileContents = fs.createReadStream(`${path}`);
    fileContents
      .pipe(ndjson.parse())
      .on('data', (obj) => {
        items.push(obj);
        // logger.debug(
        //   `[${TAG}] on-data: obj: ${JSON.stringify(obj)}`,
        // );
      })
      .on('finish', (e) => {
        if (e) {
          logger.debug(`[${TAG}] Error: ${e}`);
          return reject(e);
        }
        logger.debug(`[${TAG}] Success: len(items}: ${items.length}`);
        resolve(items);
      });
  });
}
