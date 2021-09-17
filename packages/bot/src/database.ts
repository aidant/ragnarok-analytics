import { completeEvent, completeGame, createEvent, createGame, createPlayer } from './api.js'
import { logger } from './logger.js'
import { DiscordState } from './discord.js'
import { RagnarokStatus } from './ragnarok.js'
import type { State } from './entrypoint.js'

const log = logger('state:database')

let isTrackingPlayers = false
const history: { timestamp: number, discord: DiscordState }[] = []

const startTrackingPlayers = () => {
  log('start tracking players')

  isTrackingPlayers = true
}

const handleTrackPlayers = (discord: DiscordState) => {
  if (isTrackingPlayers) {
    log('track players')

    history.push({ timestamp: Date.now(), discord })
  }
}

const stopTrackingPlayers = async () => {
  log('stop tracking players')

  isTrackingPlayers = false

  log('history: %O', history)

  const players: Record<string, Partial<Record<keyof DiscordState, number>>> = {}
  const playerMap: Record<string, { username: string, avatar: string }> = {}

  for (let index = 0; index < history.length; index++) {
    const duration = (history[index + 1]?.timestamp ?? Date.now()) - history[index].timestamp
    const discord = history[index].discord

    for (const vc of Object.getOwnPropertyNames(discord) as (keyof DiscordState)[]) {
      for (const player of discord[vc]) {
        playerMap[player.id] = { username: player.username, avatar: player.avatar }

        players[player.id] ??= {}
        players[player.id][vc] ??= 0
        players[player.id][vc]! += duration
      }
    }
  }

  history.length = 0

  log('players: %O', players)

  const game: string[][] = [[], [], []]

  for (const player of Object.getOwnPropertyNames(players)) {
    const vcs = players[player]
    const maxTime = Math.max(...Object.values(vcs))

    if (vcs.lobby === maxTime) game[0].push(player)
    if (vcs.team1 === maxTime) game[1].push(player)
    if (vcs.team2 === maxTime) game[2].push(player)
  }

  log('game: %O', game)

  for (let index = 0; index < game.length; index++) {
    const players = game[index]

    for (const player of players) {
      try {
        log(
          'create player: %s, %s, %s, %s, %s',
          index,
          gameId!,
          player,
          playerMap[player].username,
          playerMap[player].avatar
        )
        await createPlayer(index, gameId!, player, playerMap[player].username, playerMap[player].avatar)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

let eventId: number | null = null
let gameId: number | null = null

export const handleStateChange = async (oldState: State | null, newState: State) => {
  log(oldState, newState)

  if (
    oldState?.ragnarok.status !== RagnarokStatus.Event &&
    newState.ragnarok.status === RagnarokStatus.Event
  ) {
    eventId ??= await createEvent()
  }
  
  if (
    oldState?.ragnarok.status !== RagnarokStatus.Game &&
    newState.ragnarok.status === RagnarokStatus.Game
  ) {
    eventId ??= await createEvent()
    gameId ??= await createGame(eventId)

    startTrackingPlayers()
  }

  if (
    oldState?.ragnarok.status === RagnarokStatus.Game && 
    newState.ragnarok.status === RagnarokStatus.Event
  ) {
    await stopTrackingPlayers()

    if (gameId) {
      await completeGame(gameId)
      gameId = null
    }
  }

  if (
    oldState?.ragnarok.status !== RagnarokStatus.Idle && 
    newState.ragnarok.status === RagnarokStatus.Idle
  ) {
    await stopTrackingPlayers()

    if (gameId) {
      await completeGame(gameId)
      gameId = null
    }
    if (eventId) {
      await completeEvent(eventId)
      eventId = null
    }
  }

  handleTrackPlayers(newState.discord)
}
