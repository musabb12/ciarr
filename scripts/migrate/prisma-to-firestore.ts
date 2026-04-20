import { PrismaClient } from '@prisma/client'
import { FIRESTORE_COLLECTIONS } from '../../src/lib/firebase/collections'
import { loadMigrationEnv } from './load-env'

const prisma = new PrismaClient()
loadMigrationEnv()

function logStep(message: string) {
  process.stdout.write(`[migrate] ${message}\n`)
}

async function migrateSettings() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.setting.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    const ref = db.collection(FIRESTORE_COLLECTIONS.settings).doc(row.key)
    batch.set(ref, {
      key: row.key,
      value: row.value,
      type: row.type ?? 'json',
      group: row.group ?? 'general',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`settings: ${rows.length}`)
}

async function migrateWebsites() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.displayWebsite.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    const ref = db.collection(FIRESTORE_COLLECTIONS.websites).doc(row.id)
    batch.set(ref, {
      slug: row.slug,
      title: row.title,
      titleEn: row.titleEn,
      description: row.description,
      descriptionEn: row.descriptionEn,
      url: row.url,
      category: row.category,
      technologies: row.technologies ? JSON.parse(row.technologies) : [],
      images: row.images ? JSON.parse(row.images) : [],
      badges: row.badges ? JSON.parse(row.badges) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      featured: row.featured,
      status: row.status,
      client: row.client,
      provider: row.provider,
      price: row.price,
      demoUrl: row.demoUrl,
      hidden: row.hidden,
      displayOrder: row.displayOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`websites: ${rows.length}`)
}

async function migrateNews() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.newsItem.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    batch.set(db.collection(FIRESTORE_COLLECTIONS.news).doc(row.id), {
      text: row.text,
      icon: row.icon,
      active: row.active,
      priority: row.priority,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`news: ${rows.length}`)
}

async function migrateServices() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.siteService.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    batch.set(db.collection(FIRESTORE_COLLECTIONS.services).doc(row.id), {
      title: row.title,
      description: row.description,
      icon: row.icon,
      active: row.active,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`services: ${rows.length}`)
}

async function migrateContacts() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.contactMessage.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    batch.set(db.collection(FIRESTORE_COLLECTIONS.contacts).doc(row.id), {
      name: row.name,
      email: row.email,
      phone: row.phone,
      subject: row.subject,
      message: row.message,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`contacts: ${rows.length}`)
}

async function migrateBackgrounds() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.backgroundImage.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    batch.set(db.collection(FIRESTORE_COLLECTIONS.backgrounds).doc(row.id), {
      url: row.url,
      title: row.title,
      active: row.active,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`backgrounds: ${rows.length}`)
}

async function migrateLogs() {
  const { getFirebaseAdminServices } = await import('../../src/lib/firebase-admin')
  const services = getFirebaseAdminServices()
  if (!services) throw new Error('Firebase is not configured')
  const { db } = services

  const rows = await prisma.systemLog.findMany()
  const batch = db.batch()
  rows.forEach((row) => {
    batch.set(db.collection(FIRESTORE_COLLECTIONS.logs).doc(row.id), {
      action: row.action,
      user: row.user,
      ip: row.ip,
      status: row.status,
      details: row.details,
      createdAt: row.createdAt.toISOString(),
    })
  })
  if (rows.length > 0) await batch.commit()
  logStep(`logs: ${rows.length}`)
}

async function run() {
  logStep('starting prisma -> firestore backfill')
  await migrateSettings()
  await migrateWebsites()
  await migrateNews()
  await migrateServices()
  await migrateContacts()
  await migrateBackgrounds()
  await migrateLogs()
  logStep('done')
}

run()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
