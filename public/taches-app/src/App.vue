<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import './assets/css/global.css'

import { useTableauStore } from './stores/store'

/**
 * Vérifie si l'utilisateur est connecté
 * @returns True si l'utilisateur est connecté, false sinon
 */
const isLoggedIn = computed(() => {
  return useTableauStore().getJwt() !== null
})
</script>

<template>
  <header>
    <nav v-if="!isLoggedIn">
      <RouterLink to="/tableaux" class="logo">Tableaux</RouterLink>
      <RouterLink to="/inscription">Inscription</RouterLink>
      <RouterLink to="/connexion">Connexion</RouterLink>
    </nav>
    <nav v-else="isLoggedIn">
      <RouterLink to="/tableaux" class="logo">Tableaux</RouterLink>
      <a>Connecté</a>
    </nav>
  </header>

  <!-- Notifications de '@kyvg/vue3-notification-->
  <notifications position="center" />

  <RouterView />
</template>

<style scoped></style>
