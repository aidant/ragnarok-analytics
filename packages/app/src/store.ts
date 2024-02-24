import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat, gql } from '@apollo/client/core'
import { getAccessToken } from '@lazy/oauth2-implicit-grant-client'
import { get, writable } from 'svelte/store'

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
  playerStarred: boolean | null

  member: Member
}

export interface Member {
  memberId: number
  memberDiscordId: string
  memberDiscordAvatar: string
  memberDiscordUsername: string
}

export const getEvents = ({ retry = true } = {}) =>
  client
    .query({
      fetchPolicy: 'network-only',
      query: gql`
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
                playerStarred

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
      `,
    })
    .then(
      response => events.set(response.data.events),
      async error => {
        if (retry) {
          await handleLogin()
          return getEvents({ retry: false })
        } else {
          throw error
        }
      }
    )

export const setPlayerStarred = async (playerId: number, playerStarred: boolean) => {
  await client.mutate({
    mutation: gql`
      mutation setPlayerStarred(
        $playerId: Int!
        $playerStarred: Boolean!
      ) {
        updatePlayer(
          data: { playerStarred: { set: $playerStarred } }
          where: { playerId: $playerId }
        ) {
          playerId
        }
      }
    `,
    variables: { playerId, playerStarred }
  })

  await getEvents({ retry: false })
}

export const handleLogin = async () => {
  const accessToken = await getAccessToken('https://discord.com/api/oauth2/authorize', {
    prompt: 'none',
    client_id: '886418657616486450',
    scope: 'identify',
    redirect_uri: 'https://ragnarok-analytics.app.aidan.pro/',
    // redirect_uri: 'http://localhost:3000/',
  }).catch(() =>
    getAccessToken('https://discord.com/api/oauth2/authorize', {
      client_id: '886418657616486450',
      scope: 'identify',
      redirect_uri: 'https://ragnarok-analytics.app.aidan.pro/',
      // redirect_uri: 'http://localhost:3000/',
    })
  )

  token.set(accessToken)
}

export const token = writable(localStorage.getItem('token'))
export const time = writable(new Date())
export const events = writable<Event[]>([])

token.subscribe($token => localStorage.setItem('token', $token))
setInterval(() => time.set(new Date()), 1000)
