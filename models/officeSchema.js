import  { Schema, model} from "mongoose";
import addressSchema from "./addressSchema";

const officeSchema = new Schema ({
    name: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type : addressSchema,
        required: true
    },

})
const Office = model('Office', officeSchema);
export default Office;