import { Schema, model } from 'mongoose'

const addressSchema = new Schema ( {

        locationName : {
            type : String,
        },

        city : {
            type : String,
            required: true
        },

        state: {
            type: String,
        },

        zipcode: {
            type: Number
        }


    })

export default addressSchema;  