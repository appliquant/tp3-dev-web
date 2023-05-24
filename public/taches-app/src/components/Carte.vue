<script setup lang="ts">
import { ref } from 'vue'

import type { PropsCarte } from '@/props/PropsCarte'
import ModalCarte from './ModalCarte.vue'

/**
 * Afficher ou non le modal
 */
const showModal = ref(false)

/**
 * Props de la carte
 */
const props = defineProps<PropsCarte>()
</script>

<template>
  <!-- Contenu -->
  <div class="container" @click="showModal = true">
    <p>{{ props.titre }}</p>
    <p v-if="props.dateLimite !== null">
      {{
        new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(props.dateLimite))
      }}
    </p>
  </div>

  <!-- Modal carte -->
  <Teleport to="body">
    <ModalCarte :card="props" :show="showModal" @close="showModal = false">
      <template #body>
        <!-- <p class="badge badge--date">
          {{ props._id }}
        </p> -->

        <form action="">
          <label for="date"><h3>Date limite</h3></label>
          <input id="date" type="date" style="width: 100%" />

          <label for="description">
            <h3>Description</h3>
          </label>
          <textarea id="description" maxlength="500" placeholder="Description...">{{
            props.description
          }}</textarea>

          <button class="button--primary">Modifier</button>
        </form>
      </template>
    </ModalCarte>
  </Teleport>
</template>

<style scoped>
.container {
  cursor: pointer;
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
  padding: 1em;
  margin: 1em auto 1em auto;
  list-style: none;
}

.container:hover {
  opacity: 0.8;
}

.badge {
  display: inline-block;
  margin-bottom: 1em;
  padding: 0.15em 0.3em 0.15em 0.3em;
  border-radius: 0.25rem;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.badge--date {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}
</style>
