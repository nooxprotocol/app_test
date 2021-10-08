import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id: {type: Number, require: true},
  name : {type : String, required: true},
  level: {type : Number, required: true}
}

const option: SchemaOptions = {
  collection: 'contract_categories'
}

export interface IContractCategory {
  _id: number;
  name: string;
  level: number;
}

export const contractCategorySchema = new Schema<IContractCategory>(schema, option);