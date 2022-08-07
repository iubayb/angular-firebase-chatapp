import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Chat, Message } from 'src/app/models/chat';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user$ = this.userService.currentUser$;
  users$ = combineLatest([this.userService.users$, this.user$]).pipe(
    map(([users, user]) => users.filter(u => u.uid != user?.uid))
  );

  currentChat?: Observable<Chat | undefined>;
  currentChatId?: string;
  messages$?: Observable<Message[]>;


  messageControl = new FormControl('');


  constructor(private userService: UserService, private chatService: ChatService, private authService: AuthService, private router: Router) { }



  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  selectChat(user: User) {
    this.chatService
      .existingChat(user.uid)
      .pipe(
        switchMap((chatId) => {
          if (!chatId) {
            return this.chatService.chat(user);
          } else {
            return of(chatId);
          }
        })
      )
      .subscribe((chatId) => {
        this.currentChatId = chatId;
        this.currentChat = this.chatService.chats$.pipe(map((chats) => chats.find((c) => c.id == chatId)));
        this.messages$ = this.chatService.getMessages$(chatId);
      });
  }

  sendMessage(e: Event) {
    e.preventDefault()
    const message = this.messageControl.value;
    if (message && this.currentChatId) {
      this.chatService
        .sendMessage(this.currentChatId, message).subscribe()
      this.messageControl.setValue('');
    }
  }
}
