"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class DbModel {
    constructor() {
        this.database = null;
        mongodb_1.MongoClient
            .connect("mongodb://localhost:27017")
            .then((db) => this.database = db.db('dbMessagerie'))
            .catch((reason) => console.log(reason));
    }
    addUser(username, password, mail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.database.collection('users')
                .insertOne({ username: username, password: password, mail: mail });
        });
    }
    checkIfUserExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const i = yield this.database.collection('users').find({ username: username }).count();
            return i;
        });
    }
    checkIfPasswordMatches(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const i = yield this.database.collection('users').find({ username: username, password: password }).count();
            //console.log('message returned:'+ i[0].username);
            return i;
        });
    }
    checkIfMailExists(mail) {
        return __awaiter(this, void 0, void 0, function* () {
            const i = yield this.database.collection('users').find({ mail: mail }).count();
            return i;
        });
    }
    addMessage(content, author, date) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.database.collection('messages').insertOne({ content: content, author: author, date: date });
        });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.database.collection('messages').find().toArray();
        });
    }
}
exports.DbModel = DbModel;
