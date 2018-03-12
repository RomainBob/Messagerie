"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(server, connection, db) {
        this.server = server;
        this.connection = connection;
        this.db = db;
        this.usernameRegex = /^[a-zA-Z0-9]*$/;
        this.username = null;
        connection.on('message', (message) => this.onMessage(message.utf8Data));
        connection.on('close', () => server.removeClient(this));
        connection.on('close', () => server.broadcastUsersList());
        connection.on('close', () => server.broadcastUserConnection('disconnection', this.username));
    }
    sendMessage(type, data) {
        const message = { type: type, data: data };
        this.connection.send(JSON.stringify(message));
    }
    sendUsersList(content) {
        const users_list = content;
        this.sendMessage('users_list', users_list);
    }
    sendInstantMessage(content, author, date) {
        const instantMessage = { content: content, author: author, date: date };
        this.sendMessage('instant_message', instantMessage);
    }
    sendInvitation(dest, username) {
        const invitation = [dest, username];
        this.sendMessage('invitation', invitation);
    }
    sendContact(contact) {
        this.sendMessage('contact', contact);
    }
    sendUserConnection(connection, username) {
        this.sendMessage(connection, username);
    }
    onInstantMessage(content, participants) {
        if (!(typeof 'content' === 'string'))
            return;
        if (this.username == null)
            return;
        this.server.broadcastInstantMessage(content, this.username, participants);
    }
    onInvitation(dest) {
        if (!(typeof 'dest' === 'string'))
            return;
        if (!this.usernameRegex.test(dest))
            return;
        this.server.broadcastInvitation(dest, this.username);
    }
    onContact(username) {
        this.username = username;
        this.server.broadcastContact(username);
    }
    onUserLogin(username) {
        if (!(typeof 'username' === 'string'))
            return;
        if (!this.usernameRegex.test(username))
            return;
        this.username = username;
        this.sendMessage('login', 'ok');
        this.server.broadcastUsersList();
        this.server.broadcastUserConnection('connection', username);
    }
    onMessage(utf8Data) {
        const message = JSON.parse(utf8Data);
        switch (message.type) {
            case 'instant_message':
                this.onInstantMessage(message.data.content, message.data.participants);
                break;
            case 'userLogin':
                this.onUserLogin(message.data.username);
                break;
            case 'invitation':
                this.onInvitation(message.data);
                break;
            case 'contact': this.onContact(message.data);
        }
    }
    getUserName() {
        return this.username;
    }
}
exports.Client = Client;
