<script lang='ts'>
  import { time } from '../store'
  import { formatDate, formatDuration } from '../utilities'

  export let created = true
  export let createdAt: string
  export let duration = true
  export let completedAt: string

  $: createdAtFormatted = formatDate(createdAt)
  $: completedAtFormatted = formatDuration(createdAt, completedAt ?? $time.toString())
</script>

<div class='flex flex-row gap-1'>
  {#if created}
    <span class='border rounded-lg px-2'>
      {createdAtFormatted}
    </span>
  {/if}
  {#if duration}
    <span class='border rounded-lg px-2'>
      {completedAtFormatted}
    </span>
  {/if}
</div>
