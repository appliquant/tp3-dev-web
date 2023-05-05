<script setup lang="ts">
// Source : https://vuejs.org/examples/#modal

const props = defineProps({
  /**
   * Afficher ou non le modal
   */
  show: Boolean
})

// defineEmits(['close'])

const emit = defineEmits<{
  /**
   * Event émis lors de la fermeture du modal
   */
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div v-if="props.show" class="modal-mask">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <slot name="footer">
            default footer
            <button class="button--primary" @click="$emit('close')">OK</button>
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
