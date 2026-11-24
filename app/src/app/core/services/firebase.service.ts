import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig, firebaseConfigurado } from '../firebase/firebase.config';

/** Punto único de acceso a Firebase. Si no está configurado, `activo` es false y `auth`/`db` son null. */
@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly activo = firebaseConfigurado;
  readonly app: FirebaseApp | null = this.activo ? initializeApp(firebaseConfig) : null;
  readonly auth: Auth | null = this.app ? getAuth(this.app) : null;
  readonly db: Firestore | null = this.app ? getFirestore(this.app) : null;
}
