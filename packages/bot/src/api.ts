import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core/core.cjs.js'
import { DISCORD_TOKEN } from './environment.js'
import { logger } from './logger.js'

const log = logger('api')

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://ragnarok-analytics.api.aidan.pro/',
  headers: {
    Authorization: `Bot ${DISCORD_TOKEN}`
  }
})

const CREATE_EVENT = gql`
  mutation createEvent {
    event: createEvent(data: {}) {
      eventId
    }
  }
`

export const createEvent = async (): Promise<number> => {
  const response = await client.mutate({ mutation: CREATE_EVENT })
  log('createEvent', response.data.event.eventId)
  return response.data.event.eventId
}

const CREATE_GAME = gql`
  mutation createGame($eventId: Int!) {
    game: createGame(data: { event: { connect: { eventId: $eventId } } }) {
      gameId
    }
  }
`

export const createGame = async (eventId: number): Promise<number> => {
  const response = await client.mutate({ mutation: CREATE_GAME, variables: { eventId } })
  log('createGame', eventId, response.data.game.gameId)
  return response.data.game.gameId
}

const CREATE_PLAYER = gql`
  mutation createPlayer(
    $teamId: Int!
    $gameId: Int!
    $memberDiscordId: String!
    $memberDiscordUsername: String!
    $memberDiscordAvatar: String!
  ) {
    player: createPlayer(
      data: {
        playerTeamId: $teamId
        game: { connect: { gameId: $gameId } }
        member: {
          connectOrCreate: {
            where: { memberDiscordId: $memberDiscordId }
            create: {
              memberDiscordId: $memberDiscordId
              memberDiscordUsername: $memberDiscordUsername
              memberDiscordAvatar: $memberDiscordAvatar
            }
          }
        }
      }
    ) {
      playerId
    }
  }
`

export const createPlayer = async (
  teamId: number,
  gameId: number,
  memberDiscordId: string,
  memberDiscordUsername: string,
  memberDiscordAvatar: string,
): Promise<void> => {
  const response = await client.mutate({
    mutation: CREATE_PLAYER,
    variables: { teamId, gameId, memberDiscordId, memberDiscordUsername, memberDiscordAvatar },
  })
  log('createPlayer', response.data.player.playerId)
}

const COMPLETE_GAME = gql`
  mutation completeGame(
    $gameId: Int!
    $gameCompletedAt: DateTime!
	){
    game: updateGame(
      where: { gameId: $gameId }
      data: { gameCompletedAt: { set: $gameCompletedAt } }
    ) {
      gameId
    }
  }
`

export const completeGame = async (gameId: number): Promise<number> => {
  const response = await client.mutate({
    mutation: COMPLETE_GAME,
    variables: { gameId, gameCompletedAt: new Date().toISOString() },
  })
  log('completeGame', response.data.game.gameId)
  return response.data.game.gameId
}

const COMPLETE_EVENT = gql`
  mutation completeEvent(
    $eventId: Int!
    $eventCompletedAt: DateTime!
	){
    event: updateEvent(
      where: { eventId: $eventId }
      data: { eventCompletedAt: { set: $eventCompletedAt } }
    ) {
      eventId
    }
  }
`

export const completeEvent = async (eventId: number): Promise<number> => {
  const response = await client.mutate({
    mutation: COMPLETE_EVENT,
    variables: { eventId, eventCompletedAt: new Date().toISOString() },
  })
  log('completeEvent', response.data.event.eventId)
  return response.data.event.eventId
}
