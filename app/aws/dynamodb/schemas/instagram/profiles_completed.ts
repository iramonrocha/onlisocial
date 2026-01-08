import { boolean, item, number, string } from 'dynamodb-toolbox'

export const ProfilesCompletedSchema = item({
    id: string().key(),
    user_id: string(),
    profile_id: string()
})