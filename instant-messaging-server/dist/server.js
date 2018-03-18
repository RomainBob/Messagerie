"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocket_1 = require("websocket");
const http = require("http");
const client_1 = require("./client");
const dbModel_1 = require("./dbModel");
class Server {
    constructor(port) {
        this.clients = [];
        this.db = new dbModel_1.DbModel();
        const server = this.createAndRunHttpServer(port);
        this.addWebSocketServer(server);
    }
    broadcastInstantMessage(discussionId, content, author, participants) {
        const date = new Date();
        for (const client of this.clients) {
            if (!(participants.indexOf(client.getUserName()) === -1))
                client.sendInstantMessage(content, author, date);
        }
        this.db.addMessageInHistory(discussionId, content, author, date);
    }
    broadcastUsersList() {
        for (const client of this.clients) {
            client.sendUsersList(this.getClientsList());
        }
    }
    broadcastInvitation(dest, username) {
        for (const client of this.clients) {
            if (client.getUserName() === dest)
                client.sendInvitation(dest, username);
        }
    }
    broadcastContact(dest, username) {
        for (const client of this.clients) {
            if (client.getUserName() === dest)
                client.sendContact(dest, username);
        }
    }
    broadcastUserConnection(connection, username) {
        switch (connection) {
            case 'connection':
                for (const client of this.clients) {
                    client.sendUserConnection('connection', username);
                }
                ;
                break;
            case 'disconnection':
                for (const client of this.clients) {
                    client.sendUserConnection('disconnection', username);
                }
                ;
                break;
        }
    }
    getClientsList() {
        var usersList = [];
        for (const client of this.clients) {
            usersList.push(client.getUserName());
        }
        return usersList;
    }
    createAndRunHttpServer(port) {
        const server = http.createServer(function (request, response) {
            response.writeHead(404);
            response.end();
        });
        server.listen(port, function () {
            console.log((new Date()) + ' Server is listening on port ' + port);
        });
        return server;
    }
    addWebSocketServer(httpServer) {
        const webSocketServer = new websocket_1.server({
            httpServer: httpServer,
            autoAcceptConnections: false
        });
        webSocketServer.on('request', request => this.onWebSocketRequest(request));
    }
    onWebSocketRequest(request) {
        const connection = request.accept(null, request.origin);
        const client = new client_1.Client(this, connection, this.db);
        this.clients.push(client);
    }
    removeClient(client) {
        this.clients.splice(this.clients.indexOf(client), 1);
    }
}
exports.Server = Server;
