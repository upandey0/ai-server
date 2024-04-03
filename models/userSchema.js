import { Schema, model } from 'mongoose';
import companySchema from './companySchema';

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
    required: true,
    enum: ['password', 'google', 'facebook'],
  },
  thirdPartyId: {
    type: String,
    required: function() {
      return this.authProvider !== 'password';
    },
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
});
const User = model('User', userSchema);
export default User;