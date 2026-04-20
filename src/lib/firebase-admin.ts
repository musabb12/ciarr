import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

type FirebaseAdminServices = {
  db: ReturnType<typeof getFirestore>
  bucket: ReturnType<ReturnType<typeof getStorage>['bucket']>
}

const projectId = process.env.FIREBASE_PROJECT_ID?.trim() ?? ''
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() ?? ''
const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET?.trim() || (projectId ? `${projectId}.appspot.com` : '')

function hasFirebaseServiceAccount() {
  return Boolean(projectId && clientEmail && privateKey)
}

export function getFirebaseAdminApp() {
  if (!hasFirebaseServiceAccount()) return null
  if (!storageBucket) return null

  const apps = getApps()
  if (apps.length > 0) {
    return apps[0]
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  })
}

export function getFirebaseAdminServices(): FirebaseAdminServices | null {
  const app = getFirebaseAdminApp()
  if (!app) return null

  return {
    db: getFirestore(app),
    bucket: getStorage(app).bucket(storageBucket),
  }
}

function getSafeObjectPath(path: string) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export async function uploadBufferToFirebaseStorage(params: {
  fileBuffer: Buffer
  destinationPath: string
  contentType: string
  cacheControl?: string
}) {
  const services = getFirebaseAdminServices()
  if (!services) {
    throw new Error(
      'Firebase is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY and FIREBASE_STORAGE_BUCKET in environment variables.'
    )
  }

  const { bucket } = services
  const objectPath = params.destinationPath.replace(/^\/+/, '')
  const file = bucket.file(objectPath)

  await file.save(params.fileBuffer, {
    contentType: params.contentType,
    resumable: false,
    metadata: {
      cacheControl: params.cacheControl ?? 'public,max-age=31536000',
    },
  })

  const fallbackPublicUrl = `https://storage.googleapis.com/${bucket.name}/${getSafeObjectPath(objectPath)}`

  try {
    await file.makePublic()
    return {
      objectPath,
      publicUrl: fallbackPublicUrl,
    }
  } catch {
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365 * 5,
    })
    return {
      objectPath,
      publicUrl: signedUrl,
    }
  }
}

export function buildFirebaseConfigErrorMessage() {
  return 'إعدادات Firebase غير مكتملة. أضف FIREBASE_PROJECT_ID و FIREBASE_CLIENT_EMAIL و FIREBASE_PRIVATE_KEY و FIREBASE_STORAGE_BUCKET.'
}
