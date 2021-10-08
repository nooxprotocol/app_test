import { Document, Model, Schema, SchemaOptions } from "mongoose";
import { badgeProgressSchema, IBadgeProgress } from "./badge_progress.schema";

const schema = {
  _id : {type : String, required: true}, // address
  badges: [badgeProgressSchema],
}

const option: SchemaOptions = {
  collection: 'user__badge_progresses'
}

export interface IUserBadgeProgress {
  _id : string;
  badges: Array<IBadgeProgress>;
}

export const userBadgeProgressSchema = new Schema<IUserBadgeProgress>(schema, option);
