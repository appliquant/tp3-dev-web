<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'

import { useTableauStore } from '@/stores/store'
import Tableau from '@/components/Tableau.vue'
import AddIcon from '@/components/icons/AddIcon.vue'
import Modal from '@/components/Modal.vue'
import type { PropsTableau } from '@/props/PropTableau'

const router = useRouter()
const store = useTableauStore()

const isLoading = ref(true)
const newBoard = ref('')
const userData = reactive({
  tableaux: [] as PropsTableau[]
})

const API_URL = import.meta.env.VITE_API_URL

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
      return router.push({
        name: 'connexion',
        query: { errMessage: 'Connectez-vous pour accéder à cette ressource' }
      })
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

    if (req.ok === false) {
      // Supprimer jwt
      store.$reset()

      // Redirection vers page de connexion
      return router.push({
        name: 'connexion',
        query: { errMessage: 'Connectez-vous pour accéder à cette ressource' }
      })
    }

    // Assigner données
    userData.tableaux = response

    // Loading indicator
    isLoading.value = false
  } catch (err) {
    console.error(err)
  }
}

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
        <modal :show="showModal">
          <template #header>
            <h2>Ajouter un tableau</h2>
          </template>

          <template #body>
            <form>
              <input type="text" minlength="1" maxlength="50" required v-bind="newBoard" />
            </form>
          </template>

          <template #footer>
            <button class="button--primary">Ajouter</button>
            <button class="button--secondary">Annuler</button>
          </template>
        </modal>
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
  margin-bottom: 2em;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
