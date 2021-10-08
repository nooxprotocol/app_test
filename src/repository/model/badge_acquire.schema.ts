import { Model, Schema, SchemaOptions } from "mongoose";

const schema = {
  _id: {type: Number, require: true},
  acquire: {type: Boolean, require: true},
  visible: {type: Boolean, require: false},
}

const option: SchemaOptions = {
}

export interface IBadgeAcquire {
  _id: number;
  acquire: boolean;
  visible: boolean;
}

export const badgeAcquireSchema = new Schema<IBadgeAcquire>(schema, option);