import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {
  collection: 'badges',
};

@Schema(option)
export class Badge {
  @Prop({ type: Number, require: true })
  _id: number;

  @Prop({ type: Number, require: true })
  category_id: number;

  @Prop({ type: String, require: true })
  src_type: string;

  @Prop({ type: String, require: false })
  type?: string;

  @Prop({ type: String, require: false })
  name?: string;

  @Prop({ type: String, require: false })
  value?: string;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
export type BadgeDocument = Badge & Document;
