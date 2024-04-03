import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Report', reportSchema);