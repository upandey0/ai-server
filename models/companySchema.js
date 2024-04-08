import { Schema, model } from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  country: {
    name: {
      type: String,
      required: true,
    },
    cities: [
      {
        name: {
          type: String,
          required: true,
        },
        locations: [
          {
            name: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
});
const Company = model('Company', companySchema)
export default Company;
