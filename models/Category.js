import mongoose, { model, Schema, models } from 'mongoose'

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties: [{ type: Object }],
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
})

export const Category = models?.Category || model('Category', CategorySchema)
