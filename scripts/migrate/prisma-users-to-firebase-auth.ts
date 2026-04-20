import { PrismaClient } from '@prisma/client'
import { getAuth } from 'firebase-admin/auth'
import { loadMigrationEnv } from './load-env'

const prisma = new PrismaClient()
loadMigrationEnv()

function logStep(message: string) {
  process.stdout.write(`[migrate-users] ${message}\n`)
}

async function run() {
  const { getFirebaseAdminApp } = await import('../../src/lib/firebase-admin')
  const { userProfilesRepo } = await import('../../src/lib/firebase/repos')
  const app = getFirebaseAdminApp()
  if (!app) throw new Error('Firebase is not configured')
  const auth = getAuth(app)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })

  for (const user of users) {
    const email = user.email.trim().toLowerCase()
    let uid = user.id
    try {
      const existing = await auth.getUserByEmail(email)
      uid = existing.uid
      await auth.updateUser(uid, {
        email,
        displayName: user.name ?? undefined,
        disabled: !user.isActive,
      })
    } catch {
      const created = await auth.createUser({
        uid,
        email,
        displayName: user.name ?? undefined,
        disabled: !user.isActive,
      })
      uid = created.uid
    }

    await auth.setCustomUserClaims(uid, {
      role: String(user.role || 'USER').toLowerCase(),
    })

    await userProfilesRepo.upsertProfileOnly({
      id: uid,
      email,
      name: user.name ?? null,
      phone: user.phone ?? null,
      avatar: user.avatar ?? null,
      role: String(user.role || 'USER').toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      passwordHash: user.password ?? null,
    })

    logStep(`synced user: ${email}`)
  }

  logStep(`done. total users: ${users.length}`)
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
