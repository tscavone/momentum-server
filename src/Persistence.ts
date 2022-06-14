import { MongoClient, Db } from 'mongodb'
import { IDataUser } from './shared/data_definitions/AuthedUserDefinitions'

export class Persistence {
    private _db: Db
    private static _instance: Persistence = new Persistence()
    private static DB_NAME = 'momentum'

    private constructor() {
        this._db = null
    }

    async init() {
        const uri = process.env.MONGO_MIGRATE_URI

        console.log('uri: ', uri)
        const client = new MongoClient(uri)

        await client.connect()

        this._db = client.db(Persistence.DB_NAME)
    }

    async findUser(username: string) {
        return this._db.collection<IDataUser>('users').findOne({ username })
    }
    static instance() {
        return Persistence._instance
    }
}
