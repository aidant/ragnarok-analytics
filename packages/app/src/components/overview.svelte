<script lang="ts">
  import type { Player as TPlayer} from '../store'
  import OverviewHistory from './overview-history.svelte'
  import OverviewRecentlySpectated from './overview-recently-spectated.svelte'
  import OverviewMostSpectated from './overview-most-spectated.svelte'

  export let players: TPlayer[]

  let selection = 'history'
  let component
  $: switch (selection) {
    case 'history':
      component = OverviewHistory
      break
    case 'recently-spectated':
      component = OverviewRecentlySpectated
      break
    case 'most-spectated':
      component = OverviewMostSpectated
      break
  }
</script>

<div class='border rounded-lg p-4 mt-2'>
  <div class='flex flex-row justify-between'>
    <span class='text-lg mb-2 block'>Overview</span>
    <select class='border rounded-lg py-2' bind:value={selection}>
      <option value='history'>History</option>
      <option value='recently-spectated'>Recently Spectated</option>
      <option value='most-spectated'>Most Spectated</option>
    </select>
  </div>
  <svelte:component this={component} {players} />
</div>
