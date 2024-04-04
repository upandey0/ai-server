import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  authProvider: {
    type: String,
    required: false,
    enum: ['password', 'google', 'facebook'],
  },
  thirdPartyId: {
    type: String,
  },
  auth0Id: {
    type: String,
    required: true,
  },
  isCompanySet : {
    type: Boolean,
    default: false
  },
  companies: {
    type: [Schema.Types.ObjectId],
    ref: 'Company'
  },
  refreshToken: {
    type: String,
  },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  reports: {
    type: [Schema.Types.ObjectId],
    ref: 'Report',
  },
  offices: {
    type: [Schema.Types.ObjectId],
    ref: 'Office',
  },
});
const User = model('User', userSchema);
export default User;