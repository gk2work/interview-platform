import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from './mongodb'
import { User } from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false
      try {
        await connectDB()
        // Upsert — create on first sign-in, update name/photo on later ones
        await User.findOneAndUpdate(
          { email: user.email!.toLowerCase() },
          {
            $set: {
              name: user.name ?? '',
              image: user.image ?? '',
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

    async jwt({ token, account }) {
      // account is only present on the first sign-in — use it to fetch userId once
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
