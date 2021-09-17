<script lang='ts'>
  import type { Player as TPlayer, Member as TMember } from '../store'
  import Member from './member.svelte'

  export let players: TPlayer[]

  const overview = Object.values(
    players
      .sort((a, b) => new Date(a.playerCreatedAt).getTime() - new Date(b.playerCreatedAt).getTime())
      .reduce((overview, player) => {
        overview[player.memberId] ??= { member: player.member, players: [] }
        overview[player.memberId].players.push(player)
        overview[player.memberId].players = overview[player.memberId].players.slice(-3)
        return overview
      }, {} as Record<string, { member: TMember, players: TPlayer[] }>)
    )
    .filter(player => {
      const playRate = player.players.filter(player => player.playerTeamId === 0).length / player.players.length
      if (playRate < 0.5) return false
      return true
    })
    .sort((a, b) => {
      const aPlayRate = a.players.filter(player => player.playerTeamId === 0).length / a.players.length
      const bPlayRate = b.players.filter(player => player.playerTeamId === 0).length / b.players.length
      
      if (aPlayRate === bPlayRate) {
        return 0
      } else if (aPlayRate > bPlayRate) {
        return -1
      } else if (aPlayRate < bPlayRate) {
        return +1
      }
    })
</script>

<div class='grid gap-2'>
  {#each overview as overview}
  <div class='flex flex-row gap-2 flex-1 min-w-max'>
    <Member member={overview.member} />
    <div class='flex flex-row'>
      {#each overview.players as player}
        <img src="./game-{player.playerTeamId === 0 ? 'spectated' : 'played'}.svg" />
      {/each}
    </div>
  </div>
  {/each}
</div>
