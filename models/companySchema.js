import {Schema,model} from 'mongoose'


const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    offices: {
        type: [Schema.Types.ObjectId],
        ref: 'Office'
    }
})
const Company = model('Company', companySchema);
export default Company;