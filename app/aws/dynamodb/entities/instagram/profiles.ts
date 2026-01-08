import { Entity } from 'dynamodb-toolbox'
import { ProfilesTable } from '@/aws/dynamodb/tables/instagram/profiles'
import { ProfilesSchema } from '~/aws/dynamodb/schemas/instagram/profiles'

export const Profiles = new Entity({
    name: '003_instagram_profiles',
    table: ProfilesTable,
    schema: ProfilesSchema,
    timestamps: {
        created: {
            name: 'createdAt'
        },
        modified: {
            name: 'updatedAt'
        }
    }
})