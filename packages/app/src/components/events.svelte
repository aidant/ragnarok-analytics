<script lang="ts">
  import type { Event as TEvent } from '../store'
  import Event from './event.svelte'
  
  export let events: TEvent[]
</script>

<ul class="container mx-auto flex flex-col gap-20 mt-6">
  {#each events as event}
    <li class='border rounded-md px-8 py-6'>
      <Event {event} />
    </li>
  {/each}
  <li />
</ul>
