<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import { useNotification } from '@kyvg/vue3-notification'
import { useTableauStore } from '@/stores/store'

import Tableau from '@/components/Tableau.vue'
import AddIcon from '@/components/icons/AddIcon.vue'
import ModalAjoutTableau from '@/components/ModalAjoutTableau.vue'
import type { PropsTableau } from '@/props/PropTableau'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const store = useTableauStore()
const notification = useNotification()

const isLoading = ref(true)
const userData = reactive({
  tableaux: [] as PropsTableau[]
})

const newBoardTitle = ref('')
const modalErrorMessage = ref('')
const modalSuccessMessage = ref('')

/**
 * Afficher ou non le modal d'ajout de tableau
 */
const showModal = ref(false)

/**
 * Récupérer données de l'utilisateur
 */
const fetchUserInfo = async () => {
  try {
    // Loading indicator
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
    const req = await fetch(`${API_URL}/tableaux`, params)
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (req.ok === false) {
      if (req.status === 401) {
        return redirectToLoginPage()
      }
      return notification.notify({
        title: "Récupération des informations sur l'utilisateur",
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error',
        duration: 5000
      })
    }

    // Assigner données
    userData.tableaux = response

    // Loading indicator
    isLoading.value = false
  } catch (err) {
    isLoading.value = true
    notification.notify({
      title: "Récupération des informations sur l'utilisateur",
      text: `Une erreur est survenue : ${err}`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Ajouter un tableau
 */
const addBoard = async () => {
  try {
    // Reinitaliser variables
    modalErrorMessage.value = ''
    modalSuccessMessage.value = ''

    // Validations
    if (newBoardTitle.value.length < 1 || newBoardTitle.value.length > 50) {
      modalErrorMessage.value = 'Le titre doit contenir entre 1 et 50 caractères'
      return false
    }

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
        titre: newBoardTitle.value
      })
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux`, params)
    const response = await req.json()

    if (req.ok === false) {
      if (req.status === 401) {
        return redirectToLoginPage()
      } else {
        // Afficher message d'erreur
        return (modalErrorMessage.value = response.message)
      }
    }

    // Afficher message de succès
    modalSuccessMessage.value = 'Le tableau a été ajouté avec succès'

    console.log(response)
  } catch (err) {
    notification.notify({
      title: 'Ajout du tableau',
      text: `Une erreur est survenue : ${err}`,
      type: 'error',
      duration: 5000
    })
    modalErrorMessage.value = err!.toString()
  }
}

/**
 * Supprimer un tableau
 * @param idTableau - Identifiant du tableau à supprimer
 */
const deleteBoard = async (idTableau: string) => {
  try {
    const conf = confirm('Voulez-vous vraiment supprimer ce tableau?')
    if (!conf) {
      return false
    }

    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    const params = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${idTableau}`, params)
    const response = await req.json()

    // Si il y a une erreur
    if (req.ok === false) {
      if (req.status === 401) {
        return redirectToLoginPage()
      }

      return notification.notify({
        title: 'Suppression du tableau',
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error',
        duration: 5000
      })
    }

    // Message de succès
    notification.notify({
      title: 'Suppression du tableau',
      text: 'Le tableau a été supprimé avec succès',
      type: 'success',
      duration: 3000
    })

    // Retirer tableau de la liste (sans recharger les tableaux)
    const index = userData.tableaux.findIndex((tableau) => tableau._id === idTableau)
    userData.tableaux.splice(index, 1)
  } catch (err) {
    notification.notify({
      title: 'Suppression du tableau',
      text: `Une erreur est survenue : ${err}`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Navigation vers page de tableau
 */
const navigateToBoard = (tableauId: string) => {
  return router.push({
    name: 'tableau',
    params: { tableauId }
  })
}

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

// Afficher tableaux à l'initialisation de la vue
onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <main>
    <div class="header-section">
      <h1>Tableaux</h1>
      <AddIcon class="icon icon--add" @click="showModal = !showModal" />

      <!-- Modal ajout tableau -->
      <Teleport to="body">
        <ModalAjoutTableau
          :show="showModal"
          @add="addBoard"
          @close=";(showModal = false), fetchUserInfo()"
          :error-message="modalErrorMessage"
          :success-message="modalSuccessMessage"
        >
          <template #body>
            <form @submit.prevent="">
              <label for="title"></label>
              <input
                id="title"
                name="titre"
                type="text"
                minlength="1"
                maxlength="50"
                required
                v-model="newBoardTitle"
                placeholder="Titre..."
              />
            </form>
          </template>
        </ModalAjoutTableau>
      </Teleport>
    </div>

    <div class="container">
      <Tableau
        v-for="tableau in userData.tableaux"
        :key="tableau._id"
        :_id="tableau._id"
        :titre="tableau.titre"
        :proprietaire="tableau.proprietaire"
        :listes="tableau.listes"
        @delete="(idTableau) => deleteBoard(idTableau)"
        @clicked="navigateToBoard(tableau._id)"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 5em;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 2em;
}
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  gap: 2em;
}
</style>
