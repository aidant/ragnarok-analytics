<script lang='ts'>
  import type { Player as TPlayer } from '../store'
  import Member from './member.svelte'

  export let players: TPlayer[]
</script>

{#each players as player}
  <li class='flex-none'>
    <Member member={player.member} />
  </li>
{/each}
