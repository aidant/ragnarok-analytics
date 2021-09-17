export const isProduction = process.env.NODE_ENV === 'production'

export const HOST = process.env.HOST || '0.0.0.0'
export const PORT = Number(process.env.PORT) || 8080
export const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS?.split(',') || []
