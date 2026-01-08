import { getId } from '~/utils/createId'
import { Usernames } from '~/aws/dynamodb/entities/usernames'
import { putItem } from '~/aws/dynamodb/entities/actions/putItem'
import { queryUserByUsername } from '~/aws/dynamodb/tables/actions/queryUserByUsername'
import { queryUserByUsernames } from '~/aws/dynamodb/tables/actions/queryUserByUsernames'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username } = body

    if (!username) {
        return {
            exists: false,
            message: 'Username inválido.',
        }
    }

    // 1️⃣ Verifica se já está cadastrado no sistema
    const userAlreadyRegistered = await queryUserByUsername(username)

    if (userAlreadyRegistered) {
        return {
            exists: true,
            type: 'already_registered',
            message: 'Usuário já cadastrado. Faça login para ganhar seguidores.',
        }
    }

    // 2️⃣ Verifica se já ganhou seguidores grátis
    const usernameAlreadyUsed = await queryUserByUsernames(username)

    if (usernameAlreadyUsed) {
        return {
            exists: true,
            type: 'already_got_followers',
            message: 'Usuário já recebeu seguidores. Conclua o cadastro. para ganhar mais!',
        }
    }

    // 3️⃣ Salva na lista de usernames que ganharam seguidores
    await putItem(Usernames, {
        id: getId(),
        username,
    })


    return {
        exists: false,
        type: 'new_user',
        message: 'Cadastro iniciado com sucesso!',
    }
})