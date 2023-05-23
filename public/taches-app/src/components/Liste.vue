<script setup lang="ts">
import { ref } from 'vue'

import RemoveIcon from '@/components/icons/RemoveIcon.vue'
import type { PropsListe } from '@/props/PropsListe'

/**
 * Props de la liste
 */
const props = defineProps<PropsListe>()

/**
 * Événements émis par la liste
 */
const emit = defineEmits<{
  /**
   * Émis quand le titre est modifié
   * @param listId Id de la liste à modifier
   * @param title Nouveau titre
   */
  (e: 'updateListTitle', listId: string, title: string): void

  /**
   * Émis quand l'utilisateur clique sur le bouton de suppression de la liste
   * @param listId Id de la liste à supprimer
   */
  (e: 'deleteList', listId: string): void
}>()

/**
 * Gère le changement de titre de la liste (lors du clic sur "Enter")
 * @param event Événement
 */
const handleListTitleChanged = (event: any) => {
  // Émettre l'événement
  emit('updateListTitle', props._id, event.srcElement.innerText)

  // Retirer focus
  event.srcElement.blur()
}

/**
 * Remet le titre de la liste à sa valeur initiale (lors du clic sur "Escape")
 * @param event Événement
 */
const resetTitle = (event: any) => {
  event.srcElement.innerText = props.titre
}
</script>

<template>
  <div class="list">
    <!-- Header -->
    <div class="list__header">
      <h2
        @keyup.enter="handleListTitleChanged($event)"
        @keyup.escape="resetTitle($event)"
        @blur="resetTitle($event)"
        ref="listTitle"
        class="content-editable"
        contenteditable="true"
        spellcheck="false"
      >
        {{ props.titre }}
      </h2>
      <RemoveIcon
        tabindex="3"
        class="icon list--icon--delete"
        @click="emit('deleteList', props._id)"
      />
    </div>

    <!-- Contenu -->
    <ul class="list__content">
      <li class="list__content__container">
        <p>yo</p>
      </li>
    </ul>

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
  /* filter: drop-shadow(0px 0px 10px var(--secondary-color)); */
}

.list--icon--delete {
  width: 2.2em;
  height: 2.2em;
}
</style>
