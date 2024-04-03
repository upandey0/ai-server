import { Schema, model } from 'mongoose';
import companySchema from './companySchema';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  auth0Id: {
    type: String,
    required: true,
  },
  companies: {
    type: [companySchema],
  },
  refreshToken: {
    type: String,
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  reports: {
    type: [Schema.Types.ObjectId],
    ref: 'Report',
  },
  offices: {
    type: [Schema.Types.ObjectId],
    ref: 'Office',
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
  },
});

export default model('User', userSchema);