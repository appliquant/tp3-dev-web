<script setup lang="ts">
import './auth.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTableauStore } from '@/stores/store'

const router = useRouter()

const store = useTableauStore()

const courriel = ref('')
const motDePasse = ref('')
const erreurApi = ref('')

const API_URL = import.meta.env.VITE_API_URL

/**
 * Naviguer vers dashboard
 */
const goToDashboard = () => {
  router.push({ name: 'dashboard', query: {} })
}

/**
 * Fonction pour se connecter.
 */
const handleLogin = async () => {
  if (!courriel.value || !motDePasse.value) {
    return
  }

  // Requête connection
  try {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courriel: courriel.value,
        motDePasse: motDePasse.value
      })
    }

    const reponse = await fetch(`${API_URL}/connexion`, params)
    const json = await reponse.json()

    if (reponse.ok === false) {
      erreurApi.value = json.message
      return
    }

    if (reponse.ok) {
      // Enregister le jwt token
      const jwt = reponse.headers.get('Authorization')
      if (!jwt) {
        erreurApi.value = 'Token non disponible.'
        return
      }

      store.setJwt(jwt)

      // Rediriger vers le dashboard
      goToDashboard()
    }
  } catch (err) {
    console.error(`err : ${err}`)
    erreurApi.value = 'Une erreur est survenue.'
  }
}

/**
 * Vérifier si l'utilisateur est déjà connecté.
 */
onMounted(() => {
  if (store.getJwt()) {
    goToDashboard()
  }
})
</script>

<template>
  <div class="container">
    <div class="left-side">
      <h1>Connexion</h1>
      <p>Connectez-vous pour voir vos tableaux.</p>

      <form>
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
          autocomplete="current-password"
        />

        <p class="erreur">{{ erreurApi }}</p>

        <button class="button--primary" type="submit" @click.prevent="handleLogin">
          Se connecter
        </button>
      </form>
    </div>

    <div class="right-side">
      <h1></h1>
    </div>
  </div>
</template>

<style scoped></style>
