<script lang='ts'>
  import { handleLogin, token } from '../store'

  if (!$token) handleLogin()
</script>

<nav class='flex flex-row border-b p-4'>
  <span class='inline-flex items-center'>Ragnarok Analytics</span>
  {#if !$token}
    <button class='ml-auto border rounded-lg px-4 py-2' on:click={handleLogin}>Login</button>
  {/if}
</nav>
