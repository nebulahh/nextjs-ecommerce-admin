import mongoose, { model, Schema, models } from 'mongoose'

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    // seller: { type: String },

    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object },
  },
  {
    timestamps: true,
  }
)

export const Product = models.Product || model('Product', ProductSchema)
