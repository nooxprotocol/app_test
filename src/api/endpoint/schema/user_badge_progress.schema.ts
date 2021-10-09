import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { BadgeProgress } from './badge_progress.schema';

const option: SchemaOptions = {
  collection: 'user__badge_progresses',
};

@Schema(option)
export class UserBadgeProgress {
  @Prop({ type: String, require: true })
  _id: string;

  @Prop([BadgeProgress])
  badges: Array<BadgeProgress>;
}

export const UserBadgeProgressSchema =
  SchemaFactory.createForClass(UserBadgeProgress);
export type UserBadgeProgressDocument = UserBadgeProgress & Document;
