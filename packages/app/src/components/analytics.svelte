<script lang="ts">
  import { setClient } from 'svelte-apollo'
  import Events from './events.svelte'
  import { client, getEvents } from '../store'

  setClient(client)

  const events = getEvents()
  setInterval(() => events.refetch(), 1000)
</script>

<Events events={$events.data?.events || []} />
