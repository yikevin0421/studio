
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAuth as useAuthInstance, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  bio?: string;
  createdAt: any;
  lastLogin: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of protected superadmin accounts
export const SUPERADMIN_EMAILS = [
  'yikevin0421@daegu.ac.kr',
  'rexshort160@daegu.ac.kr'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuthInstance();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        getDoc(userDocRef).then(async (userDoc) => {
          const isSuperAdminAccount = firebaseUser.email && SUPERADMIN_EMAILS.includes(firebaseUser.email);
          
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous Student',
              photoURL: firebaseUser.photoURL || '',
              role: isSuperAdminAccount ? 'superadmin' : 'user',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            setDoc(userDocRef, newProfile).catch(async () => {
              const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: newProfile,
              });
              errorEmitter.emit('permission-error', permissionError);
            });
            setProfile(newProfile);
          } else {
            const existingData = userDoc.data() as UserProfile;
            // Force superadmin role if email is in the protected list
            if (isSuperAdminAccount && existingData.role !== 'superadmin') {
              updateDoc(userDocRef, { role: 'superadmin' }).catch(async () => {
                const permissionError = new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'update',
                  requestResourceData: { role: 'superadmin' },
                });
                errorEmitter.emit('permission-error', permissionError);
              });
              setProfile({ ...existingData, role: 'superadmin' });
            } else {
              setProfile(existingData);
            }
            updateDoc(userDocRef, { lastLogin: serverTimestamp() }).catch(() => {});
          }
        });
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const login = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: 'daegu.ac.kr' });
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
