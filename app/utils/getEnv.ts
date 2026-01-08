export function getEnv(key: string, scope: 'public' | 'private' = 'private'): string {
    const config = useRuntimeConfig()
    let value = (scope === 'public' ? config.public[key] : config[key]) as string | undefined;
    if (!value) {
        value = process.env[key]
    }

    if (!value) {
        throw new Error(`Variável de ambiente ${key} não encontrada.`)
    }

    return value
}