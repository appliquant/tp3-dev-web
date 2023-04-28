<script setup lang="ts">
import './auth.css'
</script>

<template>
  <div class="container">
    <div class="left-side">
      <h1>Connexion</h1>
      <p>Connectez-vous pour voir vos tableaux.</p>

      <form>
        <label for="courriel">Courriel</label>
        <input type="email" id="courriel" placeholder="123@email.com" />

        <label for="motDePasse">Mot de passe</label>
        <input type="password" id="motDePasse" placeholder="******" />

        <button class="button--primary" type="submit">Se connecter</button>
      </form>
    </div>

    <div class="right-side">
      <h1></h1>
    </div>
  </div>
</template>

<style scoped></style>
