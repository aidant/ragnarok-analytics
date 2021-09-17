import debug from 'debug'
if (!process.env.DEBUG) debug.enable('ragnarok-analytics*')
export const log = debug('ragnarok-analytics')
export const logger = (namespace: string) => log.extend(namespace, ':')
