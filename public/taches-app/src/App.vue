<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

import { useTableauStore } from './stores/store'

import './assets/css/global.css'

const router = useRouter()
const store = useTableauStore()

router.beforeEach((to, from) => {
  // Vérifie si l'utilisateur est connecté
  isLoggedIn.value = store.getJwt() !== null
})

/**
 * Vérifie si l'utilisateur est connecté
 * @returns True si l'utilisateur est connecté, false sinon
 */
const isLoggedIn = ref(false)

/**
 * Déconnecte l'utilisateur
 */
const logout = () => {
  // Supprime le JWT du store
  store.$reset()

  // Changer la valeur de isLoggedIn
  isLoggedIn.value = false

  // Redirige vers la page de connexion
  return router.push({
    name: 'connexion',
    query: { successMessage: 'Vous avez été déconnecté avec succès.' }
  })
}
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
      <a @click="logout" class="button--link">Déconnecter</a>
    </nav>
  </header>

  <!-- Notifications de '@kyvg/vue3-notification-->
  <notifications position="center" />

  <RouterView />
</template>

<style scoped></style>
