import { Schema, SchemaOptions } from "mongoose";

const rawTransaction = {
    _id : {type : String, required: true}, //hash
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
    collection: 'raw__transaction'
  }

  export const rawTransactionSchema = new Schema(rawTransaction, option);
  