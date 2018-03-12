import { Injectable } from '@angular/core';
import { InstantMessage } from './instant-message';
import { RoutingService } from './routing.service';
import { Discussion } from './discussion'


@Injectable()
export class InstantMessagingService {
  private messages: InstantMessage[] = [];
  private users: string [] = [];
  private socket: WebSocket;
  private logged: boolean;
  private errorMessage: string;
  private participants: string [] = [];
  private invitations: string[] = [];
  private contacts: string [] = [];
  private currentDiscussionId: number;
  private discussions: Discussion[];

  public askDiscussion(contact: string) {
    for (const discussion of this.discussions) {
      if (discussion.participants.length === 1  && !(discussion.participants.indexOf(contact) === -1)){
        this.currentDiscussionId =  discussion.id;
        this.sendFetchDiscussion(); //  récupère la première discussion correspondante
        break;
      }
      if (discussion.id === this.discussions[this.discussions.length - 1].id) {
        this.sendCreateDiscussion(contact); // crée la discussion
      }
    }
  }

  public sendFetchDiscussion(){
  // envoyer this.currentDiscussionId
  }

  private sendCreateDiscussion(contact: string){

  }

  private onFetchDiscussion(participants: string[], history: InstantMessage[]){
    this.participants = [];
    this.participants = participants;
    this.messages = [];
    this.messages = history;
  }

  private onInstantMessage(message: InstantMessage) {
    this.messages.push(message);
    console.log('nouveau message');
  }

  private onUserStatusChange(userslist: string []) {
    this.users = userslist;
    console.log(this.users);
  }

  private onConnection(username: string) {
    this.messages.push(new InstantMessage(username + ' vient de rejoindre la conversation', 'Message Automatique', new Date()));
  }

  private onDisconnection(username: string) {
    this.messages.push(new InstantMessage(username + ' vient de quitter la conversation', 'Message Automatique', new Date()));
  }

  private onInvitation(invitation: string[]) {
    this.invitations.push(invitation[1]);
    console.log(this.invitations);
  }

 public  onDestContact(contact: string[]) {
    this.contacts.push(contact[1]);
    console.log(this.contacts);
  }

  public  onContact(contact: string  ) {
    this.contacts.push(contact);
    console.log(this.contacts);
    }

  private onMessage(data: string) {
    const message = JSON.parse(data);
    switch (message.type) {
      case 'instant_message': this.onInstantMessage(message.data); break;
      case 'login': this.onLogin(message.data); break;
      case 'users_list': this.onUserStatusChange(message.data); break;
      case 'connection': this.onConnection(message.data); break;
      case 'disconnection': this.onDisconnection(message.data); break;
      case 'subscription': this.onSubscription(message.data); break;
      case 'invitation': this.onInvitation(message.data); break;
      case 'contact': this.onDestContact(message.data); break;
    }
  }

  public constructor(private routing: RoutingService) {
    this.logged = false;
    this.socket = new WebSocket('ws:/localhost:4201');
    this.socket.onmessage = (event: MessageEvent) => this.onMessage(event.data);
  }

  public removeInvitation(invitation: string) {
    const index = this.invitations.indexOf(invitation);
    this.invitations.splice(index, 1);
  }

  public getMessages(): InstantMessage[] {
    return this.messages;
  }

  public getUsers(): string[] {
    return this.users;
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public getInvitations(): string[] {
    return this.invitations;
  }

  public getContacts(): string[] {
    return this.contacts;
  }

  public sendMessage(type: string, data: any) {
    const message = {type: type, data: data};
    this.socket.send(JSON.stringify(message));
  }

  public sendInstantMessage(content: string) {
    this.participants = this.users;   // liste des destinataires temporairement étendue à tous les utilisateurs connectés
    const privateMessage = {content : content, participants : this.participants}
    this.sendMessage('instant_message', privateMessage);
  }

  public sendInvitation(invitation: string) {
    this.sendMessage('invitation', invitation);
  }
  public sendContact(contact: string) {
    this.sendMessage('contact', contact);
  }

  private onLogin(state: string) {
    if (state === 'ok') {
      this.logged = true;
      this.routing.goChat();
    } else {
      this.errorMessage = state;
      this.routing.goError();
    }
  }

  private onSubscription(state: string) {
    if ( state === 'ok') {
      this.routing.goLogin();
    } else if (state === 'Pseudo déjà utilisé') {
      this.errorMessage = state;
      this.routing.goError();
    } else if (state === 'Compte déjà existant') {
      this.errorMessage = state;
      this.routing.goError();
    } else {
      this.routing.goError();
    }
  }


  public isLogged(): boolean {
    return (this.logged);
  }

  public sendLogin(username: string, password: string) {
    this.sendMessage('userLogin', {username: username, password: password});
  }

  public sendSubscription(username: string, password: string, mail: string) {
    this.sendMessage('userSubscription', {username: username, password: password, mail: mail});
  }
}
