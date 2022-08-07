import { Injectable } from '@angular/core';
import { collection, query, doc, setDoc, Firestore, docData, collectionData } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  get currentUser$(): Observable<User | null>{
    return this.authservice.currentUser$.pipe(
      switchMap(user => {
        if(!user?.uid){
          return of(null);
        }
        else{
          const ref = doc(this.firestore, 'users', user?.uid);
          return docData(ref) as Observable<User>;
        }
      })
    )
  }

  get users$(): Observable<User[]>{
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<User[]>
  }

  constructor(private firestore: Firestore, private authservice: AuthService) { }

  addUser(user: User) : Observable<any>{
    const ref = doc(this.firestore, 'users', user?.uid)
    return from(setDoc(ref, user));
  }

}
