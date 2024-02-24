const invalid = (name: string): never => {
  throw new Error(`Invalid Environment Variable: "${name}".`)
}

export const isProduction = process.env.NODE_ENV === 'production'

export const API_URL = process.env.API_URL || 'https://ragnarok-analytics.api.aidan.pro/'

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN || invalid('DISCORD_TOKEN')

export const GUILD_ID = process.env.GUILD_ID || invalid('GUILD_ID')
export const CHANNEL_ID_LOBBY = process.env.CHANNEL_ID_LOBBY || invalid('CHANNEL_ID_LOBBY')
export const CHANNEL_ID_TEAM_1 = process.env.CHANNEL_ID_TEAM_1 || invalid('CHANNEL_ID_TEAM_1')
export const CHANNEL_ID_TEAM_2 = process.env.CHANNEL_ID_TEAM_2 || invalid('CHANNEL_ID_TEAM_2')
