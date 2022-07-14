import { MigrationInterface } from 'mongo-migrate-ts'
import { Db } from 'mongodb'

export class MyMigration implements MigrationInterface {
    async up(db: Db): Promise<any> {
        const user_schema = {
            properties: {
                _id: {
                    type: 'string',
                },
                created: {
                    type: 'string',
                },
                deleted: {
                    type: 'string',
                },
                email: {
                    type: 'string',
                },
                first: {
                    type: 'string',
                },
                last: {
                    type: 'string',
                },
                password: {
                    type: 'string',
                },
                updated: {
                    type: 'string',
                },
                username: {
                    type: 'string',
                },
                storage: {
                    type: 'string',
                },
                status: {
                    type: 'number',
                },
            },
            required: [
                '_id',
                'created',
                'deleted',
                'email',
                'first',
                'last',
                'password',
                'updated',
                'username',
                'storage',
                'status',
            ],
            type: 'object',
        }

        await db.createCollection('users', {
            validator: { $jsonSchema: user_schema },
        })
    }

    async down(db: Db): Promise<any> {
        await db.dropCollection('users')
    }
}
