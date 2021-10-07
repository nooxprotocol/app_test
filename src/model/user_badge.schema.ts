import { Schema, SchemaOptions } from "mongoose";

const badgeAcquire = {
  _id: {type: Number, require: true},
  acquire: {type: Boolean, require: true},
  visible: {type: Boolean, require: false},
}

const badgeAcquireOption: SchemaOptions = {
}

const badgeAcquireSchema = new Schema(badgeAcquire, badgeAcquireOption);

const userBadge = {
  _id : {type : String, required: true}, // address
  badges: [badgeAcquireSchema],
}

const userBadgeOption: SchemaOptions = {
  collection: 'user__badge'
}

export const userBadgeSchema = new Schema(userBadge, userBadgeOption);