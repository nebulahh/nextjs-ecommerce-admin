import { mongooseConnection } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { authOptions, isAdminRequest } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const { method } = req
  await mongooseConnection()
  await isAdminRequest(req, res)

  if (method === 'GET') {
    if (req.query?.productId) {
      res.json(await Product.findOne({ _id: req.query?.productId }))
    } else {
      try {
        const session = await getServerSession(req, res, authOptions)

        res.json(await Product.find({ seller: session?.user._id }))
      } catch (error) {
        res.json(error)
      }
    }
  }

  if (method === 'POST') {
    const { title, description, price, images, category, properties, seller } =
      req.body

    try {
      if (category) {
        const productDoc = await Product.create({
          title,
          description,
          price,
          images,
          category,
          properties,
          seller,
        })
        res.json(productDoc)
      } else {
        const productDoc = await Product.create({
          title,
          description,
          price,
          images,
          properties,
          seller,
        })
        res.json(productDoc)
      }
    } catch (error) {
      res.json(error)
    }
  }

  if (method === 'PUT') {
    const { title, description, price, images, _id, category, properties } =
      req.body

    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    )
    res.json(true)
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id })
      res.json(true)
    }
  }
}
