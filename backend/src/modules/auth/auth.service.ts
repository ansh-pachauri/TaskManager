import { prisma } from '../../lib/prisma'
import { hashPassword, comparePassword } from '../../utils/hash'
import { signToken } from '../../utils/jwt'
import type { SignupInput, LoginInput } from './auth.schema'

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new Error('Email already in use')

  const passwordHash = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  const token = signToken({ userId: user.id, email: user.email })
  return { user, token }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw new Error('Invalid credentials')

  const valid = await comparePassword(input.password, user.passwordHash)
  if (!valid) throw new Error('Invalid credentials')

  const token = signToken({ userId: user.id, email: user.email })
  const { passwordHash: _ph, ...safeUser } = user
  return { user: safeUser, token }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  if (!user) throw new Error('User not found')
  return user
}
