<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import { useTableauStore } from '@/stores/store'
import Tableau from '@/components/Tableau.vue'
import AddIcon from '@/components/icons/AddIcon.vue'
import Modal from '@/components/Modal.vue'
import type { PropsTableau } from '@/props/PropTableau'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const store = useTableauStore()

const isLoading = ref(true)
const userData = reactive({
  tableaux: [] as PropsTableau[]
})

const newBoardTitle = ref('')
const modalErrorMessage = ref('')
const modalSuccessMessage = ref('')

/**
 * Afficher ou non le modal
 */
const showModal = ref(false)

/**
 * Trouver données de l'utilisateur
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
      return redirectToLoginPage()
    }

    // Assigner données
    userData.tableaux = response

    // Loading indicator
    isLoading.value = false
  } catch (err) {
    console.error(err)
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
      if (req.status === 500) {
        return redirectToLoginPage()
      }

      // Afficher message d'erreur
      modalErrorMessage.value = response.message
    }

    // Afficher message de succès
    modalSuccessMessage.value = 'Le tableau a été ajouté avec succès'

    console.log(response)
  } catch (err) {
    console.error(err)
  }
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
        <Modal
          :show="showModal"
          @add="addBoard"
          @close=";(showModal = false), fetchUserInfo()"
          :error-message="modalErrorMessage"
          :success-message="modalSuccessMessage"
        >
          <template #body>
            <form>
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
        </Modal>
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
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  gap: 2em;
}
</style>
