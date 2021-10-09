import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { BadgeAcquire } from './badge_acquire.schema';

const option: SchemaOptions = {
  collection: 'user__badges',
};

@Schema(option)
export class UserBadge {
  @Prop({ type: String, require: true })
  _id: string;

  @Prop([BadgeAcquire])
  badges: Array<BadgeAcquire>;
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);
export type UserBadgeDocument = UserBadge & Document;
