import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
    isAdmin: { type: Boolean },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
