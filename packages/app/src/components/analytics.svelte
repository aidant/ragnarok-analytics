<script lang="ts">
  import Events from './events.svelte'
  import { events, getEvents } from '../store'

  getEvents()
  setInterval(() => getEvents(), 1000 * 15)
</script>

<Events events={$events} />
