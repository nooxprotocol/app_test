import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id : {type : String, required: true}, //hash
  transaction_index : {type : Number, required: true},
  from_address : {type : String, required: true},
  to_address : {type : String, required: false},
  value : {type : String, required: true},
  gas : {type : String, required: true},
  gas_price : {type : String, required: true},
  input : {type : String, required: true},
  receipt_gas_used : {type : String, required: true},
  receipt_contract_address : {type : String, required: false},
  receipt_status : {type : String, required: true},
  block_timestamp : {type : Date, required: true},
  block_number : {type : Number, required: true},
  block_hash : {type : String, required: true}, 
}

const option: SchemaOptions = {
  collection: 'raw__transactions'
}

export interface IRawTransaction {
  _id : string;
  transaction_index : number;
  from_address : string;
  to_address? : string;
  value : string;
  gas : string;
  gas_price : string;
  input : string;
  receipt_gas_used : string;
  receipt_contract_address? : string;
  receipt_status : string;
  block_timestamp : Date;
  block_number : number;
  block_hash : string;
}

export const rawTransactionSchema = new Schema<IRawTransaction>(schema, option);