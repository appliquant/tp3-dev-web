<script setup lang="ts">
import type { PropsCarte } from '@/props/PropsCarte'
import { ref } from 'vue'

import ModalCarte from './ModalCarte.vue'

/**
 * Props de la carte
 */
const props = defineProps<PropsCarte>()

/**
 * Afficher ou non la modal de carte
 */
const showCardModal = ref(false)
</script>

<template>
  <!-- Contenu -->
  <div @click="showCardModal = true">
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
    <ModalCarte :show="showCardModal" :card="props" @close="showCardModal = false" />
  </Teleport>
</template>
