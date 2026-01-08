import { scan } from '@/aws/dynamodb/tables/actions/scan'
import { Profiles } from '~/aws/dynamodb/entities/instagram/profiles'
import { verifyToken } from '@/utils/verifyToken'
import { ProfilesCompleted } from '~/aws/dynamodb/entities/instagram/profiles_completed'
import { Users } from '~/aws/dynamodb/entities/users'
import { getItem } from '~/aws/dynamodb/entities/actions/getItem'

export default defineEventHandler(async (event) => {

    const token = getCookie(event, 'token')
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded?.id) return null

    const { id } = decoded

    // Todos os perfis
    const { Items: profiles = [] } = await scan(Profiles)

    // Pega o usuário logado
    const { Item: user } = await getItem(Users, { id })
    if (!user) return null // se não existir, retorna null

    // Todos os perfis completados
    const { Items: profilesCompleteds } = await scan(ProfilesCompleted)

    // Filtra apenas os completados do usuário atual
    const myCompletedProfiles = profilesCompleteds.filter(profile => profile.user_id === id)

    // Cria um Set com os user_id completados para busca rápida
    const completedIds = new Set(myCompletedProfiles.map(profile => profile.profile_id)) // ou user_id, dependendo do que identifica o perfil

    // Filtra perfis que não sejam do usuário atual e que não estejam completados
    const filtered = profiles.filter(profile => {
        return profile.user_id !== id
            && !completedIds.has(profile.id)
            && user.points >= profile.cost_per_follower
    })

    // Ordenação por cost_per_follower
    return filtered.sort((a, b) => b.cost_per_follower - a.cost_per_follower)
})