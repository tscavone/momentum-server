import { MongoClient, Db, WithId, InsertOneResult, UpdateResult } from 'mongodb'
import { IPersistenceUser, UserStatus } from './PersistenceDefinitions'

export class Persistence {
    private _db: Db
    private static _instance: Persistence = new Persistence()
    private static DB_NAME = 'momentum'
    private static USERS_COLUMN: string = 'users'

    private constructor() {
        this._db = null
    }

    async init() {
        const uri = process.env.MONGO_MIGRATE_URI

        const client = new MongoClient(uri)

        await client.connect()

        this._db = client.db(Persistence.DB_NAME)
    }

    async findUser(username: string): Promise<WithId<IPersistenceUser>> {
        return this._db
            .collection<IPersistenceUser>(Persistence.USERS_COLUMN)
            .findOne({ username })
    }

    async insertUser(
        newUser: IPersistenceUser
    ): Promise<InsertOneResult<IPersistenceUser>> {
        return this._db
            .collection<IPersistenceUser>(Persistence.USERS_COLUMN)
            .insertOne(newUser)
    }

    async updateUser(user: IPersistenceUser): Promise<UpdateResult> {
        return this._db
            .collection<IPersistenceUser>(Persistence.USERS_COLUMN)
            .updateOne(
                {
                    _id: user._id,
                },
                {
                    $set: {
                        status: UserStatus.initialized,
                    },
                }
            )
    }

    static instance() {
        return Persistence._instance
    }
}
