import { createToken } from '@/utils/createToken'
import { comparePassword } from '@/utils/encryptPassword'
import { queryUserByUsername } from '@/aws/dynamodb/tables/actions/queryUserByUsername'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      return {
        message: 'Username e senha são obrigatórios.'
      }
    }

    const user = await queryUserByUsername(username)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.'
      }
    }

    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) {
      return {
        message: 'Senha incorreta.'
      }
    }

    const token = createToken(user.id)
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

    return {
      message: 'Autenticado com sucesso',
    }
  } catch (error) {
    console.error('Erro no login:', error)
    return {
      message: 'Erro interno do servidor.'
    }
  }
})