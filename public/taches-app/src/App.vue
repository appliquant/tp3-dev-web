<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import './assets/css/global.css'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/" class="logo">Tableaux</RouterLink>
      <RouterLink to="/inscription">Inscription</RouterLink>
      <RouterLink to="/connexion">Connexion</RouterLink>
    </nav>
  </header>

  <!-- Notifications de '@kyvg/vue3-notification-->
  <notifications position="center" />

  <RouterView />
</template>

<style scoped></style>
