import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { logger } from 'src/logger/winston';
import { initDB } from './logic/init_db';
import { BadgeDocument } from './schema/badge.schema';
import { ContractDocument } from './schema/contract.schema';
import { ContractCategoryDocument } from './schema/contract_category.schema';
import { RawTransactionDocument } from './schema/raw_transaction.schema';
import { UserBadgeDocument } from './schema/user_badge.schema';
import { UserBadgeProgressDocument } from './schema/user_badge_progress.schema';

@Injectable()
export class EndpointService {
  constructor(
    @Inject('BADGE_MODEL') private readonly badgeModel: Model<BadgeDocument>,
    @Inject('CONTRACT_MODEL')
    private readonly contractModel: Model<ContractDocument>,
    @Inject('CONTRACT_CATEGORY_MODEL')
    private readonly contractCategoryModel: Model<ContractCategoryDocument>,
    @Inject('RAW_TRANSACTION_MODEL')
    private readonly rawTransactionModel: Model<RawTransactionDocument>,
    @Inject('USER_BADGE_PROGRESS_MODEL')
    private readonly userBadgeProgressModel: Model<UserBadgeProgressDocument>,
    @Inject('USER_BADGE_MODEL')
    private readonly userBadgeModel: Model<UserBadgeDocument>,
  ) {}

  async findBadgeDocs(): Promise<BadgeDocument[]> {
    return this.badgeModel.find({}).exec();
  }

  async findContractDocs(): Promise<ContractDocument[]> {
    return this.contractModel.find({}).exec();
  }

  async findContractCategoryDocs(): Promise<ContractCategoryDocument[]> {
    return this.contractCategoryModel.find({}).exec();
  }

  async findRawTransactionDocs(): Promise<RawTransactionDocument[]> {
    return this.rawTransactionModel.find({}).exec();
  }

  async findUserBadgeProgressDocs(): Promise<UserBadgeProgressDocument[]> {
    logger.debug('aaa');
    return this.userBadgeProgressModel.find({}).exec();
  }

  async findUserBadgeDocs(): Promise<UserBadgeDocument[]> {
    return this.userBadgeModel.find({}).exec();
  }

  async initDB(): Promise<string> {
    await initDB(this.badgeModel, './sample/badge.json', 100_000, 'id');
    await initDB(
      this.contractModel,
      './sample/contract.json',
      100_000,
      'address',
    );
    for (let i = 0; i < 5; i++) {
      await initDB(
        this.rawTransactionModel,
        `./sample/transaction/transaction_${i}.json`,
        100_000,
        'hash',
      );
    }

    return 'InitDB Success';
  }

  async updateUserBadgeProgress(id: string): Promise<string> {
    const doc: Document = await this.updateUserBadgeProgressDB(id);
    return `Updated BadgeProgress: ${id}`;
  }

  async updateUserBadge(id: string): Promise<string> {
    return `Updated Badge: ${id}`;
  }

  // //====임시====//
  //비즈니스로직에서 특정유저의 활동에 대한 갱신을 수행한다.(Focus!)
  private async updateUserBadgeProgressDB(id: string): Promise<Document> {
    let user = await this.userBadgeProgressModel.findById(id);
    if (user == null) {
      user = await this.userBadgeProgressModel.create({ _id: id });
      logger.debug(`Create User: ${user}`);
    } else {
      logger.debug(`Already Exist ${id}`);
    }
    await this._updateUserBadgeProgressDB(user);
    return user;
  }

  //Contract를 순회하여 해당하는 뱃지를 가져와 해당유저의 BadgeProgress를 갱신한다.
  private async _updateUserBadgeProgressDB(user: Document) {
    const initBlockBH = 10_000_000;
    const maxIndex = 20_000_000;

    const contracts = await this.contractModel.find({});
    for (const contract of contracts) {
      let srcIndex = 0;
      let dstIndex: number = initBlockBH;
      while (srcIndex != dstIndex) {
        const docs = await this.rawTransactionModel.find(
          {
            from_address: user['id'],
            to_address: contract.id,
            block_number: { $gte: srcIndex, $lt: dstIndex },
          },
          { _id: 1 },
        );
        const txs: Array<string> = docs.map((x) => x.id);
        logger.debug(
          `Txs) txs: ${txs.length}, srcIndex: ${srcIndex}, dstIndex: ${dstIndex}, from: ${user['id']}, to: ${contract.id}`,
        );

        const badges = await this.badgeModel.find({
          category_id: { $in: contract.category },
        });
        for (const j in badges) {
          await this._updateBadgeProgress(
            user,
            contract,
            badges[j],
            txs,
            srcIndex,
            dstIndex,
          );
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
  private async _updateBadgeProgress(
    user: Document,
    contract: Document,
    badge: Document,
    txIds: Array<string>,
    srcIndex: number,
    dstIndex: number,
  ) {
    const obj = user['badges'].id(badge['id']);
    logger.debug(`badgeProgress: ${obj}, ${badge['id']}`);
    //BadgeProgress갱신로직
    const txs: Array<Document> = await this.rawTransactionModel.find({
      _id: { $in: txIds },
      block_number: { $gte: srcIndex, $lt: dstIndex },
    });
    if (obj == null) {
      user['badges'].push({
        _id: badge['id'],
        type: badge['type'],
        value: String(txs.length),
        sync_bh: dstIndex,
      });
    } else {
      const sync_bh: number = user['badges'].id(badge['id']).sync_bh;
      if (sync_bh > dstIndex) {
        return;
      }

      const oValue = user['badges'].id(badge['id'])['value'];
      const prevValue: number = parseInt(oValue);
      const dst: number = prevValue + txs.length;
      user['badges'].id(badge['id'])['value'] = dst.toString();
      user['badges'].id(badge['id'])['sync_bh'] = dstIndex;
    }
  }

  //비즈니스로직에서 특정유저의 뱃지에 대한 갱신을 수행한다.
  //TODO
  private async updateUserBadgeDB(id: string): Promise<Document> {
    let user = await this.userBadgeModel.findById(id);
    if (user == null) {
      user = await this.userBadgeModel.create({ _id: id });
      logger.debug(`Create User: ${user}`);
    } else {
      logger.debug(`Already Exist ${id}`);
    }
    await this._updateUserBadgeDB(user);
    return user;
  }

  //Contract를 순회하여 해당하는 뱃지를 가져와 해당유저의 BadgeAcquire를 갱신한다.
  private async _updateUserBadgeDB(user: Document) {
    const contracts = await this.contractModel.find({});
    for (const contract of contracts) {
      const categoryIds: Array<number> = contract['category'];
      const badges = await this.badgeModel.find({
        category_id: { $in: categoryIds },
      });
      logger.debug(`Badges: ${badges.length}`);
      for (const badge of badges) {
        //logger.debug(`Badge: ${badge}`)
        await this._updateBadgeAcquire(user, contract, badge);
      }
    }
  }

  //BadgeProgressDB에 기록된 value값을 기준으로 BadgeAcquire를 갱신합니다.
  private async _updateBadgeAcquire(
    user: Document,
    contract: Document,
    badge: Document,
  ) {
    const obj = user['badges']['id'](badge['id']);
    logger.debug(`BadgeAcuire: ${obj}, ${badge['id']}, ${user['id']}`);
    //BadgeAcquire갱신로직
    if (obj == null) {
      const doc: Document = await this.userBadgeProgressModel.findById(
        user['id'],
      );
      if (doc == null) {
        return;
      }
      //COUNT일때는 number처리
      const srcValue: number = doc['badges']['id'](badge['id'])['value'];
      const isAcquire: boolean = srcValue > badge['value'];
      user['badges'].push({
        _id: badge['id'],
        acquire: isAcquire,
        visible: true,
      });
    } else {
      let isAcquire: boolean = user['badges']['id'](badge['id'])['acquire'];
      if (isAcquire == true) {
        return;
      }
      const doc = await this.userBadgeProgressModel.findById(user['id']);
      //COUNT일때는 number처리
      const srcValue: number = doc['badges']['id'](badge['id'])['value'];
      isAcquire = srcValue > badge['value'];
      user['badges']['id'](badge['id'])['acquire'] = isAcquire;
    }
  }
}
