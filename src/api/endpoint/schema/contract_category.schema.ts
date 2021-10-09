import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {
  collection: 'contractCategories',
};

@Schema(option)
export class ContractCategory {
  @Prop({ type: Number, require: true })
  _id: number;

  @Prop({ type: String, require: true })
  name: string;

  @Prop({ type: Number, require: true })
  level: number;
}

export const ContractCategorySchema =
  SchemaFactory.createForClass(ContractCategory);
export type ContractCategoryDocument = ContractCategory & Document;
