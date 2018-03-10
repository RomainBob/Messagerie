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
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.database.collection('messages').insertOne({ message: message });
        });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.database.collection('messages').find().toArray();
        });
    }
}
exports.DbModel = DbModel;
