<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed } from 'vue'

import { useTableauStore } from '@/stores/store'
import Liste from '@/components/Liste.vue'
import type { PropsTableau } from '@/props/PropTableau'
import type { PropsListe } from '@/props/PropsListe'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const route = useRoute()
const store = useTableauStore()

/**
 * Id du tableau
 */
const tableauId = ref(route.params.tableauId)

/**
 * Status de chargement
 */
const isLoading = ref(true)

/**
 * Vérifier si le tableau est chargé
 * Utilisé dans le html pour afficher le contenu principal
 */
const isLoaded = computed(() => {
  return isLoading.value === false
})

/**
 * Erreur de chargement
 */
const error = ref('')

/**
 * Données du tableau
 */
const boardData = reactive({
  board: {} as PropsTableau,
  lists: [] as PropsListe[]
})

/**
 * Rediriger vers page de connexion
 */
const redirectToLoginPage = (errMessage?: string) => {
  // Supprimer jwt
  store.$reset()

  // Redirection vers page de connexion
  return router.push({
    name: 'connexion',
    query: { errMessage: errMessage ? errMessage : 'Connectez-vous pour accéder à cette ressource' }
  })
}

/**
 * Récupérer informations du tableau
 */
const fetchBoardInfo = async () => {
  try {
    // État de chargement
    isLoading.value = true

    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${tableauId.value}`, params)
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage()
      } else if (req.status === 404) {
        error.value = response.message
      } else {
        return redirectToLoginPage()
      }
    }

    // Enregistrer données du tableau
    boardData.board = response

    // Appel des fonctions pour récupérer les informations sur les listes
    fetchBoardLists()
  } catch (err) {
    console.error(err)
  }
}

/**
 * Récupérer information sur les listes du tableau
 */
const fetchBoardLists = async () => {
  try {
    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${tableauId.value}/listes`, params)
    const response = await req.json()

    if (!req.ok) {
      return redirectToLoginPage()
    }

    // Enregistrer données des listes
    boardData.lists = response

    // État de chargement
    isLoading.value = false
  } catch (err) {
    console.error(err)
  }
}

// Afficher informations du tableau à l'initialisation de la vue
onMounted(() => {
  fetchBoardInfo()
})
</script>

<template>
  <div v-if="isLoading">
    <h1 style="margin: 2em">Chargement...</h1>
  </div>

  <div v-if="error.length > 1">
    <h1 class="error" style="margin: 2em">{{ error }}</h1>
  </div>

  <!-- Contenu principal -->
  <main v-if="isLoaded">
    <!-- header -->
    <div class="header-section">
      <h1>{{ boardData.board.titre }}</h1>

      <div class="filters">
        <h2>Filtre date limite</h2>

        <!-- Filtre -->
        <form>
          <div>
            <input type="checkbox" id="filter-date-none" name="filter-date-none" value="none" />
            <label for="filter-date-none">Aucune</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="filter-date-tomorrow"
              name="filter-date-tomorrow"
              value="tomorrow"
            />
            <label for="filter-date-tomorrow">Demain</label>
          </div>

          <div>
            <input type="checkbox" id="filter-date-late" name="filter-date-late" value="late" />
            <label for="filter-date-late">Retard</label>
          </div>
        </form>
      </div>
    </div>

    <!-- listes -->
    <ul class="horizontal-lists-container">
      <li v-for="list in boardData.lists">
        <Liste :_id="list._id" :titre="list.titre" :tableau="list.tableau" />
      </li>

      <li>
        <!-- bouton ajouter -->
        <button class="button--primary">Nouvelle liste</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
h2,
h1 {
  margin-bottom: 0;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  padding: 0.5em 3em 0.5em 3em;
}

.filters form {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: end;
  gap: 1em;
}

.filters form div {
  display: flex;
  gap: 0.3em;
}

.filters form div input[type='checkbox'] {
  margin: 0;
}

.horizontal-lists-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 20em;
  overflow-x: auto;
  gap: 3em;
  scroll-snap-type: x mandatory;
}

.horizontal-lists-container::-webkit-scrollbar {
  display: none;
}

.horizontal-lists-container li {
  list-style: none;
  padding: 0;
}
</style>
