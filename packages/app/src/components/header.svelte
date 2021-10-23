<script lang='ts'>
  import { getAccessToken } from '@lazy/oauth2-implicit-grant-client'
  import { token } from '../store'

  const handleLogin = () => {
    getAccessToken('https://discord.com/api/oauth2/authorize', { client_id: '886418657616486450', scope: 'identify' })
      .then(token.set)
  }
</script>

<nav class='flex flex-row border-b p-4'>
  <span class='inline-flex items-center'>Ragnarok Analytics</span>
  {#if !$token}
    <button class='ml-auto border rounded-lg px-4 py-2' on:click={handleLogin}>Login</button>
  {/if}
</nav>
