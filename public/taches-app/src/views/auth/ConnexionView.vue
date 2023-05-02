<script setup lang="ts">
import './auth.css'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTableauStore } from '@/stores/store'

const router = useRouter()

const store = useTableauStore()

const email = ref('')
const passwd = ref('')

const successApi = ref('')
const errApi = ref('')

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
  if (!email.value || !passwd.value) {
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
        courriel: email.value,
        motDePasse: passwd.value
      })
    }

    const reponse = await fetch(`${API_URL}/connexion`, params)
    const json = await reponse.json()

    if (reponse.ok === false) {
      errApi.value = json.message
      return
    }

    if (reponse.ok) {
      // Enregister le jwt token
      const jwt = reponse.headers.get('Authorization')
      if (!jwt) {
        errApi.value = 'Token non disponible.'
        return
      }

      store.setJwt(jwt)

      // Rediriger vers le dashboard
      goToDashboard()
    }
  } catch (err) {
    console.error(`err : ${err}`)
    errApi.value = 'Une erreur est survenue.'
  }
}

/**
 * Vérifier si l'utilisateur est déjà connecté.
 */
onMounted(() => {
  if (store.getJwt()) {
    goToDashboard()
  }

  // Verifier si message de succès dans le query string /inscription?successMessage=...
  const successMessage = router.currentRoute.value.query.successMessage
  const errMessage = router.currentRoute.value.query.errMessage
  if (successMessage as string) {
    const msg = (successMessage as string).slice(0, 220) // Limiter la longueur du message
    successApi.value = decodeURIComponent(msg)
  }

  if (errMessage as string) {
    const msg = (successMessage as string).slice(0, 220) // Limiter la longueur du message
    errApi.value = decodeURIComponent(msg)
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
          v-model="email"
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
          v-model="passwd"
          minlength="6"
          maxlength="50"
          required
          autocomplete="current-password"
        />

        <p class="erreur">{{ errApi }}</p>
        <p class="success">{{ successApi }}</p>

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
