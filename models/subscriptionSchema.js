import mongoose, { Schema } from "mongoose";
import subscriptionFeatureSchema from "./subscriptionFeatureSchema";

const subscriptionSchema = new Schema({

    name: {
        type: String,
        required: true,
        enum: ['individual', 'professional', 'small business', 'medium business', 'enterprise']
    },

    price: {
        type: Number,
        required: true
    },


    features: {
         type :  [subscriptionFeatureSchema]
    }
        
    

})

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;