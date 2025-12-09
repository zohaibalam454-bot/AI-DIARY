import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from './db'
import type { NextAuthConfig } from 'next-auth'

export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Accept anything - always login
        return { id: '1', name: 'User', email: 'user@example.com' }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 300, // 5 minutes
  },
}

export default authOptions
