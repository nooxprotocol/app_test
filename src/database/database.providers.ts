import * as mongoose from 'mongoose';
import { option, url } from './config';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      mongoose.connect(url, option),
  },
  // {
  //   provide: 'CHILD_CONNECTION',
  //   useFactory: (): Promise<typeof mongoose> =>
  //     mongoose.connect('mongodb://localhost/ChildDB'),
  // },
];
