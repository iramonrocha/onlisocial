import { boolean, item, number, string } from 'dynamodb-toolbox'

export const ProfilesSchema = item({
    id: string().key(),
    name: string(),
    image: string(),
    status: boolean(),
    user_id: string(),
    username: string(),
    cost_per_follower: number(),
})