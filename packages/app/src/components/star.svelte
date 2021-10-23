<script lang="ts">
  import { setPlayerStarred } from '../store'

  export let playerId: number
  export let playerStarred: boolean | null

  const handleClick = () => {
    if (playerStarred === false) {
      setPlayerStarred(playerId, !playerStarred)
      playerStarred = null
    }

    if (playerStarred === true) {
      setPlayerStarred(playerId, !playerStarred)
      playerStarred = null
    }
  }
</script>

<span
  class="block w-8 h-8 bg-center bg-no-repeat bg-contain cursor-pointer"
  data-player-starred="{playerStarred ?? 'null'}"
  on:click={handleClick}
/>

<style scoped>
  span[data-player-starred="false"] {
    background-image: url('./star-outline.svg');
  }
  span[data-player-starred="false"]:hover {
    background-image: url('./star-plus-outline.svg');
  }

  span[data-player-starred="true"] {
    background-image: url('./star.svg');
  }
  span[data-player-starred="true"]:hover {
    background-image: url('./star-remove.svg');
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

