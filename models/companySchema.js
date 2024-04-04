import { Schema, model } from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  country: {
    type: String,
    required: true,
  },
  cities: [{
    name: String,
    locations: [{
      name: {
        type: String,
      },
    }],
  }],
});
const Company = model('Company', companySchema)
export default Company;
