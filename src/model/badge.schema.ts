import { Schema, SchemaOptions } from "mongoose";

const badge = {
  _id : {type : Number, required: true}, // increment
  category_id: {type : Number, required: true},
  src_type: {type : String, required: true},
  type: {type : String, required: false},
  name: {type : String, required: false},
  value: {type : String, required: false},
}

const badgeOption: SchemaOptions = {
  collection: 'badge'
}

export const badgeSchema = new Schema(badge, badgeOption);