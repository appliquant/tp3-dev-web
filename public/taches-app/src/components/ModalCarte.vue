<script setup lang="ts">
// Source : https://vuejs.org/examples/#modal

import RemoveIcon from '@/components/icons/RemoveIcon.vue'
import type { PropsCarte } from '@/props/PropsCarte'

const props = defineProps<{
  /**
   * Afficher ou non le modal
   */
  show: boolean

  /**
   * Carte à afficher dans le modal
   */
  card: PropsCarte
}>()

const emit = defineEmits<{
  /**
   * Événement émis lors de la fermeture du modal
   */
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="modalCarte">
    <div v-if="props.show" class="modal-mask">
      <div class="modal-container">
        <!-- header -->
        <div class="modal-header">
          <h2>{{ props.card.titre }}</h2>
          <RemoveIcon class="icon icon--remove" @click="emit('close')" />
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer"></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 25em;
  margin: auto;
  padding: 2em;
  background-color: var(--primary-color);
  border-radius: 0.3em;
  transition: all 0.3s ease;
}

.modal-header {
  display: grid;
  grid-template-columns: 7fr 1fr;
  align-items: start;
}

.modal-header h2 {
  word-break: break-all;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
