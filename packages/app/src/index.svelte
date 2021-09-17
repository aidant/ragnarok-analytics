<script lang="ts">
  import Analytics from './components/analytics.svelte'
  import Header from './components/header.svelte'
  import { token } from './store'

</script>

<Header />
{#if $token}
  <Analytics />
{/if}
