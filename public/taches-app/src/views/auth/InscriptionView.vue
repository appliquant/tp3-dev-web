<script setup lang="ts">
import './auth.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nom = ref('')
const courriel = ref('')
const motDePasse = ref('')
const motDePasseConfirmation = ref('')

const errApi = ref('')

const API_URL = import.meta.env.VITE_API_URL

/**
 * Fonction pour créer un compte.
 */
const onSubmit = async () => {
  // Validation
  if (!nom.value || !courriel.value || !motDePasse.value || !motDePasseConfirmation.value) {
    errApi.value = 'Veuillez remplir tous les champs.'
    return false
  }

  // Validation mot de passe
  if (motDePasse.value !== motDePasseConfirmation.value) {
    errApi.value = 'Les mots de passe ne sont pas identiques.'
    return false
  }

  // Requête inscription
  try {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nom: nom.value,
        courriel: courriel.value,
        motDePasse: motDePasse.value,
        motDePasseConfirmation: motDePasseConfirmation.value
      })
    }

    const reponse = await fetch(`${API_URL}/inscription`, params)
    const json = await reponse.json()

    if (reponse.ok === false) {
      errApi.value = json.message
      return false
    }

    // Rediriger vers connexion avec message de succès
    router.push({
      name: 'connexion',
      query: {
        successMessage: encodeURIComponent('Vous pouvez maintenant vous connecter.')
      }
    })

    return true
  } catch (err) {
    console.error(`err : ${err}`)
    errApi.value = 'Une erreur est survenue.'
    return false
  }
}
</script>

<template>
  <div class="container">
    <div class="left-side">
      <h1>Inscription</h1>
      <p>Inscrivez-vous pour créer des tableaux.</p>

      <form>
        <label for="nom">Nom</label>
        <input type="text" id="nom" placeholder="Nom" v-model="nom" required autocomplete="name" />

        <label for="courriel">Courriel</label>
        <input
          type="email"
          id="courriel"
          placeholder="123@email.com"
          v-model="courriel"
          minlength="0"
          maxlength="50"
          required
          autocomplete="email"
        />

        <label for="motDePasse">Mot de passe</label>
        <input
          type="password"
          id="motDePasse"
          placeholder="******"
          v-model="motDePasse"
          minlength="6"
          maxlength="50"
          required
          autocomplete="new-password"
        />

        <label for="motDePasseConfirmation">Confirmation du mot de passe</label>
        <input
          type="password"
          id="motDePasseConfirmation"
          placeholder="******"
          v-model="motDePasseConfirmation"
          minlength="6"
          maxlength="50"
          required
          autocomplete="new-password"
        />

        <p class="error">{{ errApi }}</p>

        <button class="button--primary" type="submit" @click.prevent="onSubmit">S'inscrire</button>
      </form>
    </div>

    <div class="right-side">
      <h1></h1>
    </div>
  </div>
</template>

<style scoped></style>
