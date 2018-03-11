import { MongoClient, Db} from 'mongodb';

export class DbModel {
    
    database: Db = null;
    public constructor() {
        MongoClient
            .connect("mongodb://localhost:27017")
            .then( (db: Db) => this.database = db.db('dbMessagerie') )
            .catch( (reason) => console.log(reason) );
    }

    
    async addUser(username: string, password: string, mail: string): Promise<void> {
        await this.database.collection('users')
        .insertOne({ username: username, password: password, mail: mail });    
    }

     async checkIfUserExists( username: string): Promise<any> {
        const i =  await this.database.collection('users').find({username:username}).count();
        return i;
    }

    async checkIfPasswordMatches( username: string, password: string): Promise<any> {
        const i =  await this.database.collection('users').find({username:username, password:password}).count();
        //console.log('message returned:'+ i[0].username);
        return i;
    }

    async checkIfMailExists(mail: string): Promise<any> {
        const i =  await this.database.collection('users').find({mail: mail}).count();
        return i;
    }

    async addMessage(content: string, author: string, date: Date): Promise<void> {
        await this.database.collection('messages').insertOne({ content: content, author: author, date: date });
    }

    async message(): Promise <string[]> {
      return this.database.collection('messages').find().toArray();
    }
}