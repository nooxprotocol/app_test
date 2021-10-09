import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {
  collection: 'contracts',
};

@Schema(option)
export class Contract {
  @Prop({ type: String, require: true })
  _id: string;

  @Prop({ type: [Number], require: true })
  category: Array<number>;

  @Prop({ type: Boolean, require: false })
  is_proxy?: boolean;

  @Prop({ type: String, require: false })
  proxy?: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
export type ContractDocument = Contract & Document;
