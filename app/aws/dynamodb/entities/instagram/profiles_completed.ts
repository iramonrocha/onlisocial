import { Entity } from 'dynamodb-toolbox'
import { ProfilesCompletedTable } from '@/aws/dynamodb/tables/instagram/profiles_completed'
import { ProfilesCompletedSchema } from '~/aws/dynamodb/schemas/instagram/profiles_completed'

export const ProfilesCompleted = new Entity({
    name: '003_instagram_profiles_completed',
    table: ProfilesCompletedTable,
    schema: ProfilesCompletedSchema,
    timestamps: {
        created: {
            name: 'createdAt'
        },
        modified: {
            name: 'updatedAt'
        }
    }
})