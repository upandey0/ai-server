import {Schema,model} from 'mongoose'
import officeSchema from './officeSchema'

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

export default model('Company', companySchema);