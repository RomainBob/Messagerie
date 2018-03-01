import { Injectable } from '@angular/core';
import { InstantMessage } from './instant-message';

@Injectable()
export class InstantMessagingService {
  private messages: InstantMessage[] = [];
  private users: string [] = [];
  private socket: WebSocket;
  private logged: boolean;

  private onInstantMessage(message: InstantMessage) {
    this.messages.push(message);
    console.log('nouveau message');
  }

  private onUserStatusChange(userslist: string []) {
    //for (const username of userslist){
    this.users = userslist;
    console.log(this.users);
  }
  
  private onConnection(username: string) {
    this.messages.push(new InstantMessage(username + ' vient de rejoindre la conversation', 'Message Automatique', new Date()));
  }

  private onDisconnection(username: string) {
    this.messages.push(new InstantMessage(username + ' vient de quitter la conversation', 'Message Automatique', new Date()));
  }


  private onMessage(data: string) {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'instant_message': this.onInstantMessage(message.data); break;
      case 'login': this.onLogin(); break;
      case 'users_list': this.onUserStatusChange(message.data); break;
      case 'connection': this.onConnection(message.data); break;
      case 'disconnection': this.onDisconnection(message.data); break;
    }
  }

  public constructor() {
    this.logged = false;
    this.socket = new WebSocket('ws:/localhost:4201');
    this.socket.onmessage =
      (event: MessageEvent) => this.onMessage(event.data);
  }

  public getMessages(): InstantMessage[] {
    return this.messages;
  }

  public getUsers(): string[] {
    return this.users;
  }

  public sendMessage(type: string, data: any) {
    const message = {type: type, data: data};
    this.socket.send(JSON.stringify(message));
  }

  public sendInstantMessage(content: string) {
    this.sendMessage('instant_message', content);
  }

  private onLogin() {
    this.logged = true;
  }

  public isLogged(): boolean {
    return this.logged;
  }

  public sendUsername(username: string) {
    this.sendMessage('username', username);
  }
}