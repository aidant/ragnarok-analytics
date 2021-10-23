<script lang="ts">
  export let playerStarred: boolean | null
</script>

<span
  class="block w-8 h-8 bg-center bg-no-repeat bg-contain"
  data-player-starred="{playerStarred ?? 'null'}"
/>

<style scoped>
  span[data-player-starred="false"] {
    background-image: url('./star-outline.svg');
  }

  span[data-player-starred="true"] {
    background-image: url('./star.svg');
  }

  span[data-player-starred="null"] {
    background-image: url('./loading.svg');
    animation: loading 1s linear infinite;
  }

  @keyframes loading {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
</style>

