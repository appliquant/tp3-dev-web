<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, reactive, computed } from 'vue'

import { useTableauStore } from '@/stores/store'
import { useNotification } from '@kyvg/vue3-notification'

import Liste from '@/components/Liste.vue'
import RemoveIconVue from '@/components/icons/RemoveIcon.vue'
import type { PropsTableau } from '@/props/PropTableau'
import type { PropsListe } from '@/props/PropsListe'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const route = useRoute()
const store = useTableauStore()
const notification = useNotification()

/**
 * Id du tableau
 */
const tableauId = ref(route.params.tableauId)

/**
 * Status de chargement
 */
const isLoading = ref(true)

/**
 * Afficher ou non l'élément d'ajout de liste
 */
const showAddListElement = ref(false)

/**
 * Titre de la nouvelle liste
 */
const newListTitle = ref('')

/**
 * Erreur de chargement
 */
const error = ref('')

/**
 * Vérifier si le tableau est chargé
 * Utilisé dans le html pour afficher le contenu principal
 */
const isLoaded = computed(() => {
  return isLoading.value === false
})

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
      } else {
        return (error.value = response.message)
      }
    }

    // Enregistrer données du tableau
    boardData.board = response

    // Appel des fonctions pour récupérer les informations sur les listes
    fetchBoardLists()
  } catch (err) {
    notification.notify({
      title: 'Récupération des informations du tableau',
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
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
      if (req.status === 401) {
        return redirectToLoginPage()
      } else {
        return notification.notify({
          title: 'Récupération des listes',
          text: `Une erreur est survenue : ${response.message}`,
          type: 'error',
          duration: 5000
        })
      }
    }

    // Enregistrer données des listes
    boardData.lists = response

    // État de chargement
    isLoading.value = false
  } catch (err) {
    notification.notify({
      title: 'Récupération des listes',
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Ajouter une liste dans la base de données
 */
const handleAddList = async () => {
  try {
    // Validations
    if (newListTitle.value.trim().length < 1) {
      return alert('Le titre de la liste ne peut pas être vide')
    }

    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify({
        titre: newListTitle.value
      })
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${tableauId.value}/listes`, params)
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage()
      } else {
        return notification.notify({
          title: "Ajout d'une liste tableau",
          text: `Une erreur est survenue : ${response.message}`,
          type: 'error',
          duration: 5000
        })
      }
    }

    // Ajouter liste dans le tableau
    boardData.lists.push({
      _id: response.id,
      titre: newListTitle.value,
      tableau: tableauId.value.toString()
    })

    // Réinitialiser titre de la nouvelle liste
    newListTitle.value = ''

    // Cacher l'élément d'ajout de liste
    showAddListElement.value = false

    return notification.notify({
      title: "Ajout d'une liste tableau",
      text: `Liste ajoutée`,
      type: 'success',
      duration: 5000
    })
  } catch (err) {
    return notification.notify({
      title: "Ajout d'une liste tableau",
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Mettre à jour le titre d'une liste
 * @param idListe Id de la liste
 * @param title Nouveau titre
 */
const handleUpdateListeTitle = async (idListe: string, title: string) => {
  try {
    // Validations
    if (title.trim().length < 1) {
      return alert('Le titre de la liste ne peut pas être vide')
    }

    // Trouver jwt
    const jwt = store.getJwt()

    if (!jwt) {
      return redirectToLoginPage()
    }

    const params = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify({
        titre: title
      })
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${tableauId.value}/listes/${idListe}`, params)
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage()
      } else {
        return notification.notify({
          title: "Mise à jour du titre d'une liste",
          text: `Une erreur est survenue : ${response.message}`,
          type: 'error',
          duration: 5000
        })
      }
    }

    // Mettre à jour le titre de la liste
    const listIndex = boardData.lists.findIndex((list) => list._id === idListe)
    boardData.lists[listIndex].titre = title

    return notification.notify({
      title: "Mise à jour du titre d'une liste",
      text: `Titre mis à jour`,
      type: 'success',
      duration: 5000
    })
  } catch (err) {
    notification.notify({
      title: "Mise à jour du titre d'une liste",
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
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
        <Liste
          :_id="list._id"
          :titre="list.titre"
          :tableau="list.tableau"
          @update-list-title="(idListe, title:string) => handleUpdateListeTitle(idListe, title)"
        />
      </li>

      <!-- bouton ajouter liste -->
      <li>
        <div v-if="showAddListElement === false" class="element-add-new-list">
          <button class="button--primary" @click="showAddListElement = !showAddListElement">
            Nouvelle liste
          </button>
        </div>

        <form v-else v-on:submit.prevent="handleAddList" class="element-add-new-list">
          <label>
            <input
              autofocus
              v-model="newListTitle"
              type="text"
              placeholder="Nom de la liste..."
              autocomplete="off"
            />
          </label>

          <div>
            <button class="button--primary">Ajouter liste</button>
            <RemoveIconVue class="icon" @click="showAddListElement = !showAddListElement" />
          </div>
        </form>
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

.element-add-new-list {
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
  padding: 1em;
  list-style: none;
  transition: all 1s ease-in-out;
}

.element-add-new-list div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.element-add-new-list div svg {
  width: 2.2em;
  height: 2.2em;
}
</style>
