import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {};
@Schema(option)
export class BadgeProgress {
  @Prop({ type: Number, require: true })
  _id: number;

  @Prop({ type: String, require: true })
  type: string;

  @Prop({ type: String, require: true })
  value: string;

  @Prop({ type: String, require: true })
  sync_bh: string;
}

export const BadgeProgressSchema = SchemaFactory.createForClass(BadgeProgress);
export type BadgeProgressDocument = BadgeProgress & Document;
