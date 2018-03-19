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

    public sendContact(dest, username) {
       const contact = [dest, username];
       this.sendMessage('contact', contact);
    }
    
    public sendUserConnection(connection: string, username: string){
        this.sendMessage(connection, username);
    }

    private onInstantMessage(discussionId: string, content: string, participants: string[]): void {
        if (!(typeof 'content' === 'string')) return;
        if (this.username==null) return;
        this.server.broadcastInstantMessage(discussionId, content, this.username, participants);
    }
/*
    async onInvitation(dest){
        if (!(typeof 'dest' === 'string')) return;
        if (!this.usernameRegex.test(dest)) return;
        await this.db.addInvitationsInUsersCollection (this.username, dest);
        await this.db.createDiscussion(this.username, dest);
        const id_discussion = await this.db.getCountersIdwithOutIncrementation('idIncrementDiscussion');
        await this.db.addDiscussionIdToUser (this.username, id_discussion[0].sequence_value);
        await this.db.addDiscussionIdToUser (dest, id_discussion[0].sequence_value);
        this.server.broadcastInvitation(dest, this.username);
       
    }
    
    async onDestContact(dest) {
        await this.db.addContactsInUsersCollection  (dest, this.username);
        await this.db.addContactsInUsersCollection  (this.username, dest);
        this.server.broadcastContact(dest, this.username);
        
    }
  */    
    private onInvitation(dest){
        if (!(typeof 'dest' === 'string')) return;
        if (!this.usernameRegex.test(dest)) return;
        this.server.broadcastInvitation(dest, this.username);
    }
    
    private onDestContact(dest) {
        this.server.broadcastContact(dest, this.username);
    }
  

    async onUserLogin(username, password) {
        const i = await this.db.checkIfUserExists(username);
        if (i === 1 ){ 
            const verifyPassword = await this.db.verifyPasswordWithHashCode (username, password);  
            if (!verifyPassword){
                this.sendMessage('login', 'Mot de passe incorrect');
                return;
            } else {
            this.username = username;
            this.sendMessage('login', 'ok');
            this.server.broadcastUsersList();
            this.server.broadcastUserConnection('connection', username); 
            }
        } else {
            this.sendMessage('login', 'Login non reconnu');
            return;
        }     
        
    }

    async onUserSubscription(username, password, mail) {
        const i = await this.db.checkIfMailExists(mail);
        const j = await this.db.checkIfUserExists(username); 
        if (i === 1 ){ 
            this.sendMessage('subscription', 'Compte déjà existant');
            return;
        } else if (j === 1 ){
            this.sendMessage('subscription', 'Pseudo déjà utilisé');
            return;
        } else {
            this.db.addUser(username, password, mail);   
            this.sendMessage('subscription', 'ok');
        }
    }


    private onMessage(utf8Data: string): void {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message': this.onInstantMessage(message.data.content, message.data.participants, message.data.discussionId); break;
            case 'userSubscription': this.onUserSubscription(message.data.username, message.data.password, message.data.mail); break;
            case 'userLogin': this.onUserLogin(message.data.username, message.data.password); break;
            case 'invitation': this.onInvitation(message.data); break;
            case 'contact': this.onDestContact(message.data); break;
            case 'discussion': this.onFetchDiscussion(message.data); break;
            case 'createDiscussion': this.onCreateDiscussion(message.data); break;
            case 'addParticipant': this.onAddParticipant(message.data.discussionId, message.data.contactId); break;  
            case 'quitDiscussion': this.onQuitDiscussion(message.data); break;  
       }
    }

    async onFetchDiscussion(discussionId: string) {
        console.log('on entre dans la fonction onFetchDiscussion ' + discussionId );
        const participants = await this.db.getParticipants(discussionId);
        console.log('FetchDiscussion ' + discussionId + ' : trouve participants' + participants[0].sequence_value);
        const history = await this.db.getHistory(discussionId);        
        console.log('FetchDiscussion ' + discussionId + ' : trouve historique');
        this.sendMessage('discussion', {discussionId, participants, history});
    }

    async onCreateDiscussion(contact: string) {
        console.log('on entre dans la fonction onCreateDiscussion avec ' + this.username + '' + contact);
        const discussionId = await this.db.createDiscussion(this.username, contact);
        console.log('a créé la disc et va la recharger ' + discussionId);
        this.onFetchDiscussion(discussionId);
        console.log('a chargé la disc ' + discussionId +'; onCreateDiscussion '+contact+' terminé' );
    //   await this.db.addDiscussionIdToUser(iDSender, id_discussion);
    //  await this.db.addDiscussionIdToUser(iDReceiver, id_discussion);
    }

    private onAddParticipant(discussionId: string, contactId: string) {
        console.log('ajout participant a' + discussionId);
//        this.db.pushParticipant(discussionId, contactId)) doit trier les participants
// l'envoyer coté serveur pour qu'il rafraichisse la discussion de tous les participants
//        this.onFetchDiscussion(discussionId);
    }

    private onQuitDiscussion(discussionId: string) {
        console.log('quitte discussion' + discussionId);
//        this.db.pullParticipant(discussionId, this.username));
//        récupérer les infos liste des discussions
    }

    public getUserName(){
        return this.username;
    }

}