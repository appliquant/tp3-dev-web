<script setup lang="ts">
import RemoveIcon from './icons/RemoveIcon.vue'
import type { PropsTableau } from '@/props/PropTableau'

// https://vuejs.org/guide/typescript/composition-api.html#syntax-limitations
const props = defineProps<PropsTableau>()

const emit = defineEmits<{
  /**
   * Événement émis lors de la supression d'un tableau
   * @param id - Identifiant du tableau à supprimer
   */
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div class="board">
    <div class="board__icons">
      <RemoveIcon class="icon board__icon--delete" @click="$emit('delete', props._id)" />
    </div>
    <div class="board__title">{{ props.titre }}</div>
  </div>
</template>

<style scoped>
.board {
  border: 0.1em solid var(--secondary-color);
  border-radius: 0.3em;
  width: 15em;
  padding: 1em;
  word-wrap: break-word;
  max-height: 12em;
  overflow: auto;
  cursor: pointer;
}

.board__icons {
  display: inline-block;
  margin-bottom: 1em;
  cursor: pointer;
  user-select: none;
}
.board__icon--delete {
  width: 1.5em;
  height: 1.5em;
}
</style>
