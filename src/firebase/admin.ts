import * as admin from 'firebase-admin';

let adminApp: admin.app.App | null = null;

// Service Account environment variable should be set in your hosting environment.
// It's a JSON string.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

/**
 * Initializes the Firebase Admin SDK.
 * This function is idempotent, meaning it can be called multiple times without re-initializing.
 */
export function initializeAdminApp() {
  if (admin.apps.length > 0) {
    adminApp = admin.app();
    return;
  }

  if (!serviceAccount) {
    // In a local dev environment, you might not have the service account env var.
    // The Admin SDK can sometimes discover credentials automatically.
    // If not, you might need to set up GOOGLE_APPLICATION_CREDENTIALS.
    console.warn(
      'FIREBASE_SERVICE_ACCOUNT environment variable not set. ' +
      'Attempting to initialize admin app with default credentials.'
    );
    adminApp = admin.initializeApp();
    return;
  }
  
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // IMPORTANT: The storageBucket URL must match the one in your Firebase project.
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'studio-1337196521-82ace.appspot.com',
  });
}

/**
 * Gets the initialized Firebase Admin App instance.
 * Throws an error if the app has not been initialized.
 * @returns {admin.app.App} The Firebase Admin App instance.
 */
export function getAdminApp(): admin.app.App {
  if (!adminApp) {
    throw new Error(
      'Firebase Admin SDK has not been initialized. Call initializeAdminApp() first.'
    );
  }
  return adminApp;
}

/**
 * Gets the Firebase Admin Auth service.
 * @returns {admin.auth.Auth} The Firebase Admin Auth service.
 */
export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

/**
 * Gets the Firebase Admin Firestore service.
 * @returns {admin.firestore.Firestore} The Firebase Admin Firestore service.
 */
export function getAdminFirestore(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

/**
 * Gets the Firebase Admin Storage service.
 * @returns {admin.storage.Storage} The Firebase Admin Storage service.
 */
export function getAdminStorage(): admin.storage.Storage {
  return getAdminApp().storage();
}
