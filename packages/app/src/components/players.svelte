<script lang='ts'>
  import type { Player as TPlayer } from '../store'
  import Member from './member.svelte'
  import Star from './star.svelte'

  export let players: TPlayer[]
</script>

{#each players as player}
  <li class='flex-none flex flex-row justify-between'>
    <Member member={player.member} />
    <Star playerId={player.playerId} playerStarred={player.playerStarred} />
  </li>
{/each}
