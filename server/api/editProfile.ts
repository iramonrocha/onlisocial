import { Profiles } from '~/aws/dynamodb/entities/instagram/profiles'
import { updateItem } from '~/aws/dynamodb/entities/actions/updateItem'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { profile_id, status, cost_per_follower } = body

    await updateItem(Profiles, {
        id: profile_id,
        status,
        cost_per_follower,
        updated_at: new Date().toISOString(),
    })
})