import { Schema, SchemaOptions } from "mongoose";

const contractCategory = {
  _id: {type: Number, require: true},
  name : {type : String, required: true},
  level: {type : Number, required: true}
}

const categoryCategoryOption: SchemaOptions = {
  collection: 'contract_category'
}

const contract = {
    _id : {type : String, required: true}, // address
    category: [Number],
    is_proxy: Boolean
  }

  const contractOption: SchemaOptions = {
    collection: 'contract'
  }

  export const contractCategorySchema = new Schema(contractCategory, categoryCategoryOption);
  export const contractSchema = new Schema(contract, contractOption);
  