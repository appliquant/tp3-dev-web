<script setup lang="ts">
import './auth.css'
</script>

<template>
  <div class="container">
    <div class="left-side">
      <h1>Inscription</h1>
      <p>Inscrivez-vous pour créer des tableaux.</p>

      <form>
        <label for="courriel">Courriel</label>
        <input type="email" id="courriel" placeholder="123@email.com" />

        <label for="motDePasse">Mot de passe</label>
        <input type="password" id="motDePasse" placeholder="******" />

        <label for="motDePasseConfirmation">Confirmation du mot de passe</label>
        <input type="password" id="motDePasseConfirmation" placeholder="******" />

        <button class="button--primary" type="submit">S'inscrire</button>
      </form>
    </div>

    <div class="right-side">
      <h1></h1>
    </div>
  </div>
</template>

<style scoped></style>
