import { Entity } from 'dynamodb-toolbox'
import { UsernamesTable } from '@/aws/dynamodb/tables/usernames'
import { UsernamesSchema } from '~/aws/dynamodb/schemas/usernames'

export const Usernames = new Entity({
    name: '003_usernames',
    table: UsernamesTable,
    schema: UsernamesSchema,
    timestamps: {
        created: {
            name: 'createdAt'
        },
        modified: {
            name: 'updatedAt'
        }
    }
})