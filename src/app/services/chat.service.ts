import { Injectable } from '@angular/core';
import { collectionData, Firestore, where, addDoc, collection, query, Timestamp } from '@angular/fire/firestore';
import { orderBy } from '@firebase/firestore';
import { concatMap, Observable, map, take } from 'rxjs';
import { Chat, Message } from '../models/chat';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore, private userService: UserService) { }

  chat(cUser: User): Observable<string> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.currentUser$.pipe(
      take(1),
      concatMap(user => addDoc(ref, {
        userIds: [user?.uid, cUser?.uid],
      })),
      map(ref => ref.id)
    )
  }


  get chats$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.userService.currentUser$.pipe(
      concatMap((user) => {
        const chatQuery = query(ref, where('userIds', 'array-contains', user?.uid));
        return collectionData(chatQuery, { idField: 'id' }) as Observable<Chat[]>;
      })
    )
  }


  existingChat(cUserId: string): Observable<string | null> {
    return this.chats$.pipe(
      take(1),
      map((chats) => {
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].userIds.includes(cUserId)) {
            return chats[i].id;
          }
        }

        return null;
      })
    );
  }
  sendMessage(id: string, message: string): Observable<any> {
    const ref = collection(this.firestore, 'chats', id, 'messages');
    const time = Timestamp.fromDate(new Date());
    return this.userService.currentUser$.pipe(
      take(1),
      concatMap((user) => addDoc(ref, {
        body: message,
        senderId: user?.uid,
        sender: user?.name,
        time: time
      })),
    )
  }

  getMessages$(id: string): Observable<Message[]> {
    const ref = collection(this.firestore, 'chats', id, 'messages');
    const queryAll = query(ref, orderBy('time', 'asc'));
    return collectionData(queryAll) as Observable<Message[]>;
  }

}
