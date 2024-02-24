import 'dotenv/config.js'
import 'isomorphic-fetch'
import { distinctUntilChanged, from, map, mergeMap, pairwise, startWith } from 'rxjs'
import { eachValueFrom } from 'rxjs-for-await'
import { handleStateChange } from './database.js'
import { DiscordState, getDiscordState, onDiscordStateChange } from './discord.js'
import { RagnarokState, getRagnarokState } from './ragnarok.js'

export interface State {
  discord: DiscordState
  ragnarok: RagnarokState
}

const state$ = from(onDiscordStateChange())
  .pipe(
    startWith(null),
    mergeMap(getDiscordState),
    // startWith({
    //   lobby: users.slice(0, 19),
    //   team1: [],
    //   team2: [],
    // }),
    // startWith({
    //   lobby: users.slice(0, 7),
    //   team1: users.slice(7, 13),
    //   team2: users.slice(13, 19),
    // }),
    // startWith({
    //   lobby: users.slice(0, 19),
    //   team1: [],
    //   team2: [],
    // }),
    // startWith({
    //   lobby: users.slice(6, 13),
    //   team1: users.slice(0, 6),
    //   team2: users.slice(13, 19),
    // }),
    // startWith({
    //   lobby: users.slice(0, 19),
    //   team1: [],
    //   team2: [],
    // }),
    map(discord => ({ discord, ragnarok: getRagnarokState(discord) })),
    startWith(null),
    distinctUntilChanged(),
    pairwise(),
  )

// @ts-ignore
for await (const [oldState, newState] of eachValueFrom(state$)) {
  await handleStateChange(oldState, newState!)
}
