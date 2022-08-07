import { Injectable } from '@angular/core';
import {
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  authState,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$ = authState(this.auth);

  constructor(private auth: Auth) { }


  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password));
  }
  logout() {
    return from(this.auth.signOut());
  }
}
