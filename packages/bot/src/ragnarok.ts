import { logger } from './logger.js'
import type { DiscordState } from './discord.js'

export enum RagnarokAction {
  JoinLobby = 'join-lobby',
  JoinTeams = 'join-teams',
  Leave = 'leave',
}

export enum RagnarokStatus {
  Idle = 'idle',
  Event = 'event',
  Game = 'game'
}

export interface RagnarokState {
  status: RagnarokStatus
}

const log = logger('state:ragnarok')

export const match = (
  state: DiscordState,
  pattern: Partial<Record<keyof DiscordState, boolean>>
) => {
  if ('lobby' in pattern && Boolean(state.lobby.length) !== pattern.lobby) return false
  if ('team1' in pattern && Boolean(state.team1.length) !== pattern.team1) return false
  if ('team2' in pattern && Boolean(state.team2.length) !== pattern.team2) return false
  return true
}

export const getRagnarokAction = ($discord: DiscordState): RagnarokAction | null => {
  if (match($discord, { lobby: true, team1: false, team2: false })) {
    return RagnarokAction.JoinLobby
  }
  if (match($discord, { team1: true, team2: true })) {
    return RagnarokAction.JoinTeams
  }
  if (match($discord, { lobby: false, team1: false, team2: false })) {
    return RagnarokAction.Leave
  }
  
  return null
}

export const getRagnarokStatus = (current: RagnarokStatus, action: RagnarokAction | null) => {
  if (current === RagnarokStatus.Idle) {
    if (action === RagnarokAction.JoinLobby) return RagnarokStatus.Event
    if (action === RagnarokAction.JoinTeams) return RagnarokStatus.Game
  }
  if (current === RagnarokStatus.Event) {
    if (action === RagnarokAction.Leave) return RagnarokStatus.Idle
    if (action === RagnarokAction.JoinTeams) return RagnarokStatus.Game
  }
  if (current === RagnarokStatus.Game) {
    if (action === RagnarokAction.Leave) return RagnarokStatus.Idle
    if (action === RagnarokAction.JoinLobby) return RagnarokStatus.Event
  }
  
  return current
}

let status = RagnarokStatus.Idle

export const getRagnarokState = ($discord: DiscordState): RagnarokState => {
  status = getRagnarokStatus(status, getRagnarokAction($discord))
  const state = { status }
  log(state)
  return state
}
