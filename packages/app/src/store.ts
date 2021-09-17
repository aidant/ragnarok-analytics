import { get, writable } from 'svelte/store'
import { query } from 'svelte-apollo'
import { gql, ApolloClient, HttpLink, ApolloLink, InMemoryCache, concat } from '@apollo/client/core'

const httpLink = new HttpLink({ uri: 'https://ragnarok-analytics.api.aidan.pro/' })

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: get(token),
    },
  }))

  return forward(operation)
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
})

export interface Event {
  eventId: number
  eventLabel: string | null
  eventCreatedAt: string
  eventCompletedAt: string | null
  
  games: Game[]
}

export interface Game {
  eventId: number
  gameId: number
  gameMap: string | null
  gameWinningTeamId: number | null
  gameCreatedAt: string
  gameCompletedAt: string | null
  
  players: Player[]
}

export interface Player {
  gameId: number
  memberId: number
  playerId: number
  playerTeamId: number
  playerCreatedAt: string

  member: Member
}

export interface Member {
  memberId: number
  memberDiscordId: string
  memberDiscordAvatar: string
  memberDiscordUsername: string
}

export const getEvents = () => query<{ events: Event[] }>(gql`
  query {
    events(orderBy: { eventCreatedAt: desc }) {
      eventId
      eventLabel
      eventCreatedAt
      eventCompletedAt
      
      games {
        eventId
        gameId
        gameMap
        gameWinningTeamId
        gameCreatedAt
        gameCompletedAt
        
        players {
          gameId
          memberId
          playerId
          playerTeamId
          playerCreatedAt

          member {
            memberId
            memberDiscordId
            memberDiscordAvatar
            memberDiscordUsername
          }
        }
      }
    }
  }
`)

export const token = writable('')
export const time = writable(new Date())
setInterval(() => time.set(new Date()), 1000)
