import {connection as WebSocketConnection} from 'websocket';
import { Server } from "./server";
import { DbModel } from "./dbModel";

export class Client {
    private usernameRegex = /^[a-zA-Z0-9]*$/;
    private username: string = null;

    public constructor(private server: Server, private connection: WebSocketConnection, private db: DbModel) {
        connection.on('message', (message)=>this.onMessage(message.utf8Data));
        connection.on('close', ()=>server.removeClient(this));
        connection.on('close', ()=>server.broadcastUsersList());
        connection.on('close', ()=>server.broadcastUserConnection('disconnection',this.username));
    }

    private sendMessage(type: string, data: any): void {
        const message = {type: type, data: data};
        this.connection.send(JSON.stringify(message));
    }
   
    public sendUsersList(content: string[]) {
        const users_list = content;
        this.sendMessage('users_list', users_list);
    }

    public sendInstantMessage(content: string, author: string, date: Date) {
        const instantMessage = { content: content, author: author, date: date };
        this.sendMessage('instant_message', instantMessage);
    }

    public sendInvitation(dest : string, username: string){
        const invitation:string[] = [dest, username];
        this.sendMessage('invitation', invitation);
    }

    public sendContact(contact: string){
        this.sendMessage('contact', contact);
    }
    
    public sendUserConnection(connection: string, username: string){
        this.sendMessage(connection, username);
    }

    private onInstantMessage(content: string, participants: string[]): void {
        if (!(typeof 'content' === 'string')) return;
        if (this.username==null) return;
        this.server.broadcastInstantMessage(content, this.username, participants);
    }

    private onInvitation(dest){
        if (!(typeof 'dest' === 'string')) return;
        if (!this.usernameRegex.test(dest)) return;
        this.server.broadcastInvitation(dest, this.username);
    }
    
    private onContact(username){
        this.username = username;
        this.server.broadcastContact(username);
    }

    private onUserLogin(username) {
        if (!(typeof 'username' === 'string')) return;
        if (!this.usernameRegex.test(username)) return;
        this.username = username;
        this.sendMessage('login', 'ok');
        this.server.broadcastUsersList();
        this.server.broadcastUserConnection('connection', username);
    }

    private onMessage(utf8Data: string): void {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message': this.onInstantMessage(message.data.content, message.data.participants); break;
            case 'userLogin': this.onUserLogin(message.data.username); break;
            case 'invitation': this.onInvitation(message.data); break;
            case 'contact': this.onContact(message.data);
       }
    }

    public getUserName(){
        return this.username;
    }

}