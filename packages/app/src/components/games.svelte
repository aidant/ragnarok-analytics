<script lang="ts">
  import type { Game as TGame } from '../store'
  import Game from './game.svelte'
  import Overview from './overview.svelte'

  export let games: TGame[]
  
  $: players = games.flatMap(game => game.players)
</script>

<Overview {players} />
<ul class='mt-12 flex flex-col gap-12'>
  {#each games as game}
    <li class='border rounded-md p-2'>
      <Game {game} />
    </li>
  {/each}
</ul>
