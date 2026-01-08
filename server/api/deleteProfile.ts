import { Profiles } from '~/aws/dynamodb/entities/instagram/profiles'
import { deleteItem } from '~/aws/dynamodb/entities/actions/deleteItem'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { profile_id } = body
    
    await deleteItem(Profiles, {
        id: profile_id,
    })
})