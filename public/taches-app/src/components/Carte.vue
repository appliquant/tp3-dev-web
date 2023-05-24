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
