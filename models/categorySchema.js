import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema ( {
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Category = model('Category', categorySchema);

export default Category;