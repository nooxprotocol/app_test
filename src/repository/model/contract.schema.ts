import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id : {type : String, required: true}, // address
  category: [Number],
  is_proxy: {type : Boolean, required: false},
  proxy: {type: String, require: false}
}

const option: SchemaOptions = {
  collection: 'contracts'
}

export interface IContract {
  _id : string;
  category: Array<number>;
  is_proxy?: boolean;
  proxy?: string;
}

export const contractSchema = new Schema<IContract>(schema, option);