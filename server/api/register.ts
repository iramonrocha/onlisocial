import { getId } from '~/utils/createId'
import { Users } from '~/aws/dynamodb/entities/users'
import { createToken } from '@/utils/createToken'
import { putItem } from '~/aws/dynamodb/entities/actions/putItem'
import { encryptPassword } from '@/utils/encryptPassword'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, password } = body

    const userId = getId()
    const hashedPassword = await encryptPassword(password)

    await putItem(Users, {
        id: userId,
        points: 100,
        username,
        password: hashedPassword,
    })

    const token = createToken(userId)
    if (!token) {
        return {
            message: 'Erro ao gerar token.'
        }
    }

    setCookie(event, 'token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 // 1 hora
    })

    return { message: "Usuário criado com sucesso" }
})