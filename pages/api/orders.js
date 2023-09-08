import { mongooseConnection } from '@/lib/mongoose'
import { Order } from '@/models/Order'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth'

export default async function handler(req, res) {
  await mongooseConnection()
  const session = await getServerSession(req, res, authOptions)
  
  res.json(
   await Order.find().sort({ createdAt: -1 })
  )
}
