import { NextResponse } from 'next/server'
import { mongooseConnection } from '@/lib/mongoose'
import User from '@/models/User'
const argon2 = require('argon2')

export default async function handler(request, response) {
  const { name, email, password } = await request.body

  try {
    await mongooseConnection()
    const hashedPassword = await argon2.hash(password)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    })
    await newUser.save()

    return response.json('User has been created', {
      status: 201,
    })
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    })
  }
}
