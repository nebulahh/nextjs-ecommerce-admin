import { mongooseConnection } from '@/lib/mongoose'
import { Category } from '@/models/Category'
import { getServerSession } from 'next-auth'
import { authOptions, isAdminRequest } from './auth/[...nextauth]'

export default async function handle(req, res) {
  const { method } = req
  await mongooseConnection()
  await isAdminRequest(req, res)

  if (method === 'GET') {
    try {
      res.json(
        await Category.find().populate('parent')
      )
    } catch (error) {
      res.json(error)
    }
  }

  if (method === 'POST') {
    const { name, parentCategory, properties, createdBy } = req.body
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
      createdBy,
    })
    res.json(categoryDoc)
  }

  if (method === 'PUT') {
    const { name, parentCategory, properties, _id } = req.body
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    )
    res.json(categoryDoc)
  }

  if (method === 'DELETE') {
    const { _id } = req.query
    await Category.deleteOne({ _id })
    res.json('ok')
  }
}
