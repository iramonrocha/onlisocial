import { Users } from '~/aws/dynamodb/entities/users'
import { getItem } from '~/aws/dynamodb/entities/actions/getItem'
import { formatUser } from '@/utils/formatUser'
import { verifyToken } from '@/utils/verifyToken'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded?.id) return null

    const { id } = decoded

    const { Item } = await getItem(Users, { id })

    return formatUser(Item)
})