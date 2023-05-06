<script setup lang="ts">
// Source : https://vuejs.org/examples/#modal

import RemoveIcon from '@/components/icons/RemoveIcon.vue'

const props = defineProps({
  /**
   * Afficher ou non le modal
   */
  show: Boolean,

  /**
   * Message d'erreur à afficher sur le modal
   */
  errorMessage: String,

  /**
   * Message de succès à afficher sur le modal
   */
  successMessage: String
})

// defineEmits(['close'])

const emit = defineEmits<{
  /**
   * Événement émis lors de la fermeture du modal
   */
  (e: 'close'): void

  /**
   * Événement émis lors de l'ajout d'un tableau
   */
  (e: 'add'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div v-if="props.show" class="modal-mask">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <h2>Ajouter un tableau</h2>
          <RemoveIcon class="icon icon--remove" @click="$emit('close')" />
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <slot name="footer">
            <!-- Afficher message d'erreur-->
            <p v-if="props.errorMessage && props.errorMessage.length > 0" class="error">
              {{ props.errorMessage }}
            </p>

            <!-- Afficher message de succès-->
            <p v-if="props.successMessage && props.successMessage.length > 0" class="success">
              {{ props.successMessage }}
            </p>

            <button class="button--primary" @click="$emit('add')">Ajouter</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
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
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.icon--remove {
  width: 1.7em;
  height: 1.7em;
  margin-left: auto;
  align-self: baseline;
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
