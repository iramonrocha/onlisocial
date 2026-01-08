import Chance from 'chance'
export const getId = (...args: (string | object)[]) => {
    try {
        let options: any = null
        if (args.length > 0 && typeof args[args.length - 1] === 'object') {
            options = args.pop()
        }
        const chance = args.length > 0 ? new Chance(args.join('/')) : new Chance()
        return chance.guid(options || {})
    } catch {
        return ''
    }
}