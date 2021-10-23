<script lang="ts">
  import type { Event } from '../store'
  import Time from './time.svelte'
  import Games from './games.svelte'

  export let event: Event

  $: sortedGames = [...event.games].sort((a, b) => new Date(b.gameCreatedAt).getTime() - new Date(a.gameCreatedAt).getTime())
</script>

<div class="flex flex-row justify-between">
  <span class="whitespace-nowrap text-lg">Ragnarok Event {event.eventId}</span>
  <Time createdAt={event.eventCreatedAt} completedAt={event.eventCompletedAt} />
</div>

<Games games={sortedGames} />
