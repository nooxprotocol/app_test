import { Mongoose } from 'mongoose';
import { BadgeSchema } from './schema/badge.schema';
import { ContractSchema } from './schema/contract.schema';
import { ContractCategorySchema } from './schema/contract_category.schema';
import { RawTransactionSchema } from './schema/raw_transaction.schema';
import { UserBadgeSchema } from './schema/user_badge.schema';
import { UserBadgeProgressSchema } from './schema/user_badge_progress.schema';

export const endpointProviders = [
  {
    provide: 'BADGE_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('Badge', BadgeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CONTRACT_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('Contract', ContractSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'CONTRACT_CATEGORY_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('ContractCategory', ContractCategorySchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'RAW_TRANSACTION_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('RawTransaction', RawTransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_BADGE_PROGRESS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('UserBadgeProgress', UserBadgeProgressSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USER_BADGE_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('UserBadge', UserBadgeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
