import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './mongodb'
import { User } from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user || !user.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          image: user.image ?? null,
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      // Credentials sign-ins are handled fully in authorize() above
      if (account?.provider === 'credentials') return true

      if (account?.provider !== 'google') return false
      try {
        await connectDB()
        await User.findOneAndUpdate(
          { email: user.email!.toLowerCase() },
          {
            $set: {
              name:     user.name ?? '',
              image:    user.image ?? '',
              googleId: account.providerAccountId,
            },
          },
          { upsert: true, new: true }
        )
        return true
      } catch (err) {
        console.error('signIn callback error:', err)
        return false
      }
    },

    async jwt({ token, account, user }) {
      // On credentials sign-in, user object has the id from authorize()
      if (account?.provider === 'credentials' && user) {
        token.userId = (user as { id: string }).id
        return token
      }
      // On first Google sign-in, fetch userId from DB
      if (account) {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email!.toLowerCase() })
        if (dbUser) token.userId = dbUser._id.toString()
      }
      return token
    },

    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string
      return session
    },
  },
}
