import { Document, Model, Schema, SchemaOptions } from "mongoose";
import { badgeAcquireSchema, IBadgeAcquire } from "./badge_acquire.schema";

const schema = {
  _id : {type : String, required: true}, // address
  badges: [badgeAcquireSchema],
}

const option: SchemaOptions = {
  collection: 'user__badges'
}

export interface IUserBadge {
  _id : string
  badges: Array<IBadgeAcquire>,
}

export const userBadgeSchema = new Schema<IUserBadge>(schema, option);
