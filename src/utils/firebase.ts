import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  collection,
  writeBatch
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { UserStats, SRSItemData, DisplaySettings } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfigData);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, {}, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Connection test helper per guidelines
export async function testFirebaseConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.log('Firebase client is offline. Local-first caching active.');
    }
  }
}

/**
 * Initialize anonymous or existing user session
 */
export function initAuthSession(onUserChange: (user: FirebaseUser | null) => void): () => void {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserChange(user);
    } else {
      // Auto sign-in anonymously for frictionless persistent sync
      try {
        const cred = await signInAnonymously(auth);
        onUserChange(cred.user);
      } catch (err) {
        console.warn('Anonymous auth failed or offline:', err);
        onUserChange(null);
      }
    }
  });

  return unsubscribe;
}

/**
 * Sign in with Google (optional for cross-device manual linking)
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error('Google sign-in error:', err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Background Cloud Sync: User Profile (XP, Streak)
 */
export async function syncUserStatsToCloud(userId: string, stats: UserStats): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        userId,
        xp: stats.xp,
        streak: stats.streak,
        lastActiveDate: stats.lastActiveDate,
        cardsReviewedToday: stats.cardsReviewedToday,
        totalReviews: stats.totalReviews,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    // Silent fail in background to never block user flow
    console.warn('Background syncUserStats error:', err);
  }
}

/**
 * Background Cloud Sync: Single SRS Vocabulary Item
 */
export async function syncSRSItemToCloud(
  userId: string,
  vocabId: number,
  data: SRSItemData
): Promise<void> {
  try {
    const itemRef = doc(db, 'users', userId, 'srs', String(vocabId));
    await setDoc(
      itemRef,
      {
        vocabId,
        interval: data.interval,
        repetition: data.repetition,
        easeFactor: data.easeFactor,
        nextReview: data.nextReview,
        historyCount: data.historyCount,
        lastRating: data.lastRating || 'good',
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Background syncSRSItem error:', err);
  }
}

/**
 * Background Cloud Sync: User Settings
 */
export async function syncSettingsToCloud(userId: string, settings: DisplaySettings): Promise<void> {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'display');
    await setDoc(
      settingsRef,
      {
        showFurigana: settings.showFurigana,
        showRomaji: settings.showRomaji,
        fontSize: settings.fontSize,
        speechRate: settings.speechRate,
        theme: settings.theme,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Background syncSettings error:', err);
  }
}

/**
 * Cloud Load: Fetch full user profile on initial sign-in/mount
 */
export async function fetchCloudUserData(userId: string): Promise<{
  stats?: Partial<UserStats>;
  settings?: Partial<DisplaySettings>;
}> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const settingsDocRef = doc(db, 'users', userId, 'settings', 'display');

    const [userSnap, settingsSnap] = await Promise.all([
      getDoc(userDocRef),
      getDoc(settingsDocRef),
    ]);

    const result: { stats?: Partial<UserStats>; settings?: Partial<DisplaySettings> } = {};

    if (userSnap.exists()) {
      const data = userSnap.data();
      result.stats = {
        xp: data.xp,
        streak: data.streak,
        lastActiveDate: data.lastActiveDate,
        cardsReviewedToday: data.cardsReviewedToday,
        totalReviews: data.totalReviews,
      };
    }

    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      result.settings = {
        showFurigana: data.showFurigana,
        showRomaji: data.showRomaji,
        fontSize: data.fontSize,
        speechRate: data.speechRate,
        theme: data.theme,
      };
    }

    return result;
  } catch (err) {
    console.warn('fetchCloudUserData failed (offline):', err);
    return {};
  }
}
