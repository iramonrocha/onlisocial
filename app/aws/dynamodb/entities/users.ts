import { Entity } from 'dynamodb-toolbox'
import { UsersTable } from '@/aws/dynamodb/tables/users'
import { UsersSchema } from '~/aws/dynamodb/schemas/users'

export const Users = new Entity({
    name: '003_users',
    table: UsersTable,
    schema: UsersSchema,
    timestamps: {
        created: {
            name: 'createdAt'
        },
        modified: {
            name: 'updatedAt'
        }
    }
})