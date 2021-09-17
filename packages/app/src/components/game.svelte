<script lang="ts">
  import type { Game } from '../store'
  import Players from './players.svelte'
  import Time from './time.svelte'

  export let game: Game

  const spectators = game.players.filter(player => player.playerTeamId === 0)
  const team1 = game.players.filter(player => player.playerTeamId === 1)
  const team2 = game.players.filter(player => player.playerTeamId === 2)
</script>

<div class="flex flex-row justify-between">
  <span>Game {game.gameId}</span>
  <Time createdAt={game.gameCreatedAt} completedAt={game.gameCompletedAt} created={false} />
</div>

<div class="border rounded-lg p-2 my-2">
  <span class="block mb-4">Spectators</span>
  <ul class="flex flex-row flex-wrap gap-2">
    <Players players={spectators} />
  </ul>
</div>
<div class="flex flex-row gap-4">
  <ul class="flex flex-col gap-2 border rounded-lg p-2 my-2 w-1/2">
    Team 1
    <Players players={team1} />
  </ul>
  <ul class="flex flex-col gap-2 border rounded-lg p-2 my-2 w-1/2">
    Team 2
    <Players players={team2} />
  </ul>
</div>
