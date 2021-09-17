<script lang="ts">
  import type { Game as TGame } from '../store'
  import Game from './game.svelte'
  import Overview from './overview.svelte'

  export let games: TGame[]
  
  const players = games.flatMap(game => game.players)
</script>

<Overview {players} />
<ul>
  {#each games as game}
    <li class='border rounded-md p-2 my-2'>
      <Game {game} />
    </li>
  {/each}
</ul>
