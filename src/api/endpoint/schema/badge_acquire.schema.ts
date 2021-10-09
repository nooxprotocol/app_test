import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {};
@Schema(option)
export class BadgeAcquire {
  @Prop({ type: Number, require: true })
  _id: number;

  @Prop({ type: Boolean, require: true })
  acquire: boolean;

  @Prop({ type: Boolean, require: false })
  visible?: boolean;
}

export const BadgeAcquireSchema = SchemaFactory.createForClass(BadgeAcquire);
export type BadgeAcquireDocument = BadgeAcquire & Document;
