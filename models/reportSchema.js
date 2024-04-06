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
    companyBelongs : {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    thumbnailURL : {
        type: String,
       
    }
  },
  { timestamps: true }
);
const Report = model('Report', reportSchema);
export default Report;