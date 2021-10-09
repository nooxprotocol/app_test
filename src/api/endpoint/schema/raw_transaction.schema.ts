import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const option: SchemaOptions = {
  collection: 'raw__transactions',
};

@Schema(option)
export class RawTransaction {
  @Prop({ type: String, require: true })
  _id: string;

  @Prop({ type: Number, require: true })
  transaction_index: number;

  @Prop({ type: String, require: true })
  from_address: string;

  @Prop({ type: String, require: false })
  to_address?: string;

  @Prop({ type: String, require: true })
  value: string;

  @Prop({ type: String, require: true })
  gas: string;

  @Prop({ type: String, require: true })
  gas_price: string;

  @Prop({ type: String, require: true })
  input: string;

  @Prop({ type: String, require: true })
  receipt_gas_used: string;

  @Prop({ type: String, require: true })
  receipt_contract_address?: string;

  @Prop({ type: String, require: true })
  receipt_status: string;

  @Prop({ type: Date, require: true })
  block_timestamp: Date;

  @Prop({ type: Number, require: true })
  block_number: number;

  @Prop({ type: String, require: true })
  block_hash: string;
}

export const RawTransactionSchema =
  SchemaFactory.createForClass(RawTransaction);
export type RawTransactionDocument = RawTransaction & Document;
