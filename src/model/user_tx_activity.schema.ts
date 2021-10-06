import { Schema, SchemaOptions } from "mongoose";

const badgeProgress = {
  _id: {type: String, require: true},
  type: {type: String, require: true},
  value: {type : String, required: true},
  sync_bh: {type : Number, required: false},
}

const badgeProgressOption: SchemaOptions = {
}

const badgeProgressSchema = new Schema(badgeProgress, badgeProgressOption);

const userTxActivity = {
  _id : {type : String, required: true}, // address
  badges: [badgeProgressSchema],
}

const userTxActivityOption: SchemaOptions = {
  collection: 'user__tx_activity'
}

export const userTxActivitySchema = new Schema(userTxActivity, userTxActivityOption);