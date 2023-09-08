import mongoose, { model, models, Schema } from 'mongoose'

const OrderSchema = new Schema(
  {
    items: Object,
    name: String,
    email: String,
    address: String,
    paid: Boolean,
//    seller: { type: mongoose.Types.ObjectId, ref: 'User' },
  },

  {
    timestamps: true,
  }
)

export const Order = models?.Order || model('Order', OrderSchema)
