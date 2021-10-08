import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id : {type : Number, required: true}, // increment
  category_id: {type : Number, required: true},
  src_type: {type : String, required: true},
  type: {type : String, required: false},
  name: {type : String, required: false},
  value: {type : String, required: false},
}

const option: SchemaOptions = {
  collection: 'badges'
}

export interface IBadge {
  _id : number;
  category_id: number;
  src_type: string;
  type?: string;
  name?: string;
  value?: string;
}

export const badgeSchema = new Schema<IBadge>(schema, option);