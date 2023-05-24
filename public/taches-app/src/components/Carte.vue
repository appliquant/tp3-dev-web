<script setup lang="ts">
import type { PropsCarte } from '@/props/PropsCarte'

/**
 * Props de la carte
 */
const props = defineProps<PropsCarte>()
</script>

<template>
  <!-- Contenu -->
  <p>{{ props.titre }}</p>
  <p>{{ new Intl.DateTimeFormat('fr-CA').format(new Date(props.dateLimite)) }}</p>
</template>

<style scoped>
.list__content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.list__content::-webkit-scrollbar {
  display: none;
}

.list__content__container {
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
  padding: 1em;
  margin: 1em auto 1em auto;
  list-style: none;
}
</style>
