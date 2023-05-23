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

  /**
   * Événement émis lors du clic sur un tableau
   * Utilisé pour empêcher d'aller à la page /tableau/:id quand on clique sur le bouton de suppression
   */
  (e: 'clicked'): void
}>()
</script>

<template>
  <div class="board">
    <div class="board__icons">
      <RemoveIcon class="icon board__icon--delete" @click="$emit('delete', props._id)" />
    </div>
    <div @click="$emit('clicked')" class="board__title">{{ props.titre }}</div>
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
}

.board__title {
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
}

.board__title:hover {
  opacity: 0.8;
  text-decoration: underline var(--secondary-color) 0.2em;
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
