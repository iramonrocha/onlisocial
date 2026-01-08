export const formatUser = (user: any) => {
    delete user.password
    return user
}