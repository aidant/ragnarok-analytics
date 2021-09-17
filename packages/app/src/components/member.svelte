<script lang="ts">
  import type { Member as TMember } from '../store'

  export let member: TMember
</script>

<div class="flex flex-row items-center gap-2">
  <img
    class="rounded-full w-10 h-10 bg-black dark:bg-white"
    alt={member.memberDiscordUsername}
    src={member.memberDiscordAvatar}
  />
  <span class="overflow-ellipsis">{member.memberDiscordUsername}</span>
</div>
