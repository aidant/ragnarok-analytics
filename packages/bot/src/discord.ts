import { Client, Collection, GatewayIntentBits, GuildMember, OAuth2Scopes } from 'discord.js'
import { on, once } from 'events'
import {
  CHANNEL_ID_LOBBY,
  CHANNEL_ID_TEAM_1,
  CHANNEL_ID_TEAM_2,
  DISCORD_TOKEN,
  GUILD_ID,
} from './environment.js'
import { logger } from './logger.js'

const log = logger('state:discord')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

export interface Member {
  id: string
  username: string
  avatar: string
}

export interface DiscordState {
  readonly lobby: ReadonlyArray<Member>
  readonly team1: ReadonlyArray<Member>
  readonly team2: ReadonlyArray<Member>
}

const getMemberList = (members: Collection<string, GuildMember>): Member[] => {
  return members
    .filter((member) => !member.user.bot)
    .map((member) => ({
      id: member.id,
      username: member.displayName,
      avatar: member.user.displayAvatarURL({}),
    }))
}

export const getDiscordState = async (): Promise<DiscordState> => {
  const guild = await client.guilds.fetch(GUILD_ID)

  const [lobby, team1, team2] = await Promise.all([
    guild.channels.fetch(CHANNEL_ID_LOBBY),
    guild.channels.fetch(CHANNEL_ID_TEAM_1),
    guild.channels.fetch(CHANNEL_ID_TEAM_2),
  ])

  const state: DiscordState = {
    lobby: getMemberList(lobby!.members as Collection<string, GuildMember>),
    team1: getMemberList(team1!.members as Collection<string, GuildMember>),
    team2: getMemberList(team2!.members as Collection<string, GuildMember>),
  }
  log(state)
  return state
}

export const onDiscordStateChange = () => on(client, 'voiceStateUpdate')

await client.login(DISCORD_TOKEN)
await once(client, 'ready')
console.log(client.generateInvite({ scopes: [OAuth2Scopes.Bot] }))
