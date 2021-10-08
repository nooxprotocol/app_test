import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id: {type: Number, require: true},
  type: {type: String, require: true},
  value: {type : String, required: true},
  sync_bh: {type : Number, default: 0},
}

const option: SchemaOptions = {
}

export interface IBadgeProgress {
  _id: number;
  type: string;
  value: string;
  sync_bh: number;
}

export const badgeProgressSchema = new Schema<IBadgeProgress>(schema, option);