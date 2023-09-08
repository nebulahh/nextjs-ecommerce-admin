import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'
import { mongooseConnection } from '@/lib/mongoose'
import User from '@/models/User'
const argon2 = require('argon2')

const admins = ['olalekancrown11@gmail.com', 'olam@mail.com']

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (credentials == null) return null

        try {
          await mongooseConnection()
          const user = await User.findOne({ email: credentials.email })

          if (user) {
            const isMatch = await argon2.verify(
              user.password,
              credentials.password
            )

            if (isMatch) {
              return user
            } else {
              throw new Error('Email or password is incorrect')
            }
          } else {
            throw new Error('User not found')
          }
        } catch (error) {
          return { error }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
        }
      }
      return token
    },
    async session({ session, token, user }) {
      if (token && user) {
        session.user = token.user
      }
      if (admins.includes(session?.user?.email)) {
        session.isAdmin = true
      }

      return session
    },
  },
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!admins.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw 'not an admin'
  }
}
