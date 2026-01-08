import { verifyToken } from '@/utils/verifyToken'
import { queryUser_id } from '@/aws/dynamodb/tables/actions/queryUser_id'

export default defineEventHandler(async (event) => {

    const token = getCookie(event, 'token')
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded?.id) return null

    const { id } = decoded

    const results = await queryUser_id(id)

    return results
})