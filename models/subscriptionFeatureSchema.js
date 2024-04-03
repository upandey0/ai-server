import  { Schema } from "mongoose";

const subscriptionFeatureSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  maxReports: {
    type: Number,
    required: true
  }
});

export default subscriptionFeatureSchema;