<script setup lang="ts">
import RemoveIcon from '@/components/icons/RemoveIcon.vue'
import type { PropsListe } from '@/props/PropsListe'

/**
 * Props de la liste
 */
const props = defineProps<PropsListe>()
</script>

<template>
  <div class="list">
    <!-- Header -->
    <div class="list__header">
      <h2>{{ props.titre }}</h2>
      <RemoveIcon class="icon list--icon--delete" />
    </div>

    <!-- Contenu -->
    <ul class="list__content"></ul>

    <!-- Ajout carte -->
    <div class="list__button">
      <button class="button--primary">Ajouter</button>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0;
  word-break: break-all;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  max-height: calc(100vh - var(--header-height) - 10vh);
  padding: 1em;
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
}

.list__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  overflow-y: auto;
  max-height: 10em;
  min-height: 3em;
}

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

.list__button > button {
  width: 100%;
  filter: drop-shadow(0px 0px 10px var(--secondary-color));
}

.list--icon--delete {
  width: 2.2em;
  height: 2.2em;
}
</style>
