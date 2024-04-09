import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    subcategories: [
      {
        type: String,
        required: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);
export default Category;