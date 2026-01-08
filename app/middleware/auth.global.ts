export default defineNuxtRouteMiddleware(async (to) => {
    const { meta, query, name, path } = to
    const { requireAuth = true, redirectIfLogged = false } = meta
    const { redirect = '/dashboard' } = query

    try {
        const { user, fetchUser } = useAuthUser()

        await fetchUser()

        if (user.value) {
            if (redirectIfLogged) {
                return navigateTo(redirect as string)
            }
        } else {
            if (requireAuth) {
                return navigateTo({
                    path: '/login',
                    query: name === 'index' ? {} : { redirect: path },
                })
            }
        }
    } catch (error) {
        if (requireAuth) {
            return navigateTo({
                path: '/login',
                query: name === 'index' ? {} : { redirect: path },
            })
        }
    }
})