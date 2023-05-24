<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useTableauStore } from '@/stores/store'
import { useNotification } from '@kyvg/vue3-notification'

import Carte from '@/components/Carte.vue'
import RemoveIcon from '@/components/icons/RemoveIcon.vue'

import type { PropsFiltres } from '@/props/PropsFiltres'
import type { PropsListe } from '@/props/PropsListe'
import type { PropsCarte } from '@/props/PropsCarte'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const store = useTableauStore()
const notification = useNotification()

/**
 * Props de la liste
 */
const props = defineProps<
  PropsListe & {
    /**
     * Filtres des cartes
     */
    cardsFilters: PropsFiltres
  }
>()

/**
 * Événements émis par la liste
 */
const emit = defineEmits<{
  /**
   * Émis quand le titre est modifié
   * @param listId Id de la liste à modifier
   * @param title Nouveau titre
   */
  (e: 'updateListTitle', listId: string, title: string): void

  /**
   * Émis quand l'utilisateur clique sur le bouton de suppression de la liste
   * @param listId Id de la liste à supprimer
   */
  (e: 'deleteList', listId: string): void
}>()

/**
 * Cartes de la liste
 */
const cards = reactive({
  cards: [] as PropsCarte[]
})

/**
 * Référence vers le titre de la carte
 */
const newCardTitle = ref('')

/**
 * Afficher ou non l'élément d'ajout de carte
 */
const showAddCardElement = ref(false)

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
 * Récupère les cartes de la liste
 */
const handleFetchCards = async () => {
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
        Authorization: `${jwt}`
      }
    }

    // Filtres à envoyer
    let filters = `?cardsFilterNone=${props.cardsFilters.none}`
    filters += `&cardsFilterTomorrow=${props.cardsFilters.tomorrow}`
    filters += `&cardsFilterLate=${props.cardsFilters.late}`

    // Requête
    const req = await fetch(
      `${API_URL}/tableaux/${props.tableau}/listes/${props._id}/cartes${filters}`,
      params
    )
    const response = await req.json()

    // Si erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage(response.message)
      }

      return notification.notify({
        title: "Ajout d'une carte",
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error',
        duration: 5000
      })
    }

    // Ajouter les cartes à la liste
    cards.cards = response.map((resCard: any) => {
      // Parse date (ex : 2021-05-31T04:00:00.000Z -> format Date() de javascript)
      // resCard.dateLimite = new Date(resCard.dateLimite)
      if (resCard.dateLimite !== null) {
        resCard.dateLimite = new Date(resCard.dateLimite)
      }

      return resCard
    })
  } catch (err) {
    notification.notify({
      title: 'Récupérer les cartes',
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Ajouter une carte dans une liste
 * @param cardTitle Titre de la carte
 */
const handleAddCard = async () => {
  try {
    // Validations
    if (newCardTitle.value.trim().length < 1) {
      return alert('Le titre de la carte ne peut pas être vide')
    }

    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    // Carte à ajouter
    const newCard = {
      titre: newCardTitle.value.trim(),
      description: ' ',
      dateLimite: 'null'
    }

    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      },
      body: JSON.stringify(newCard)
    }

    // Requête
    const req = await fetch(
      `${API_URL}/tableaux/${props.tableau}/listes/${props._id}/cartes`,
      params
    )
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage()
      }
      return notification.notify({
        title: "Ajout d'une carte",
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error',
        duration: 5000
      })
    }

    // Ajouter la carte à la liste de cartes locales
    cards.cards.push({
      _id: response.id!,
      titre: newCard.titre,
      description: newCard.description,
      // @ts-ignore
      dateLimite: newCard.dateLimite === 'null' ? null : newCard.dateLimite
    })

    // Fermer l'élément d'ajout de carte
    showAddCardElement.value = false

    // Vider le titre de la carte
    newCardTitle.value = ''

    // Message de succès
    return notification.notify({
      title: "Ajout d'une carte",
      text: `Carte ajoutée`,
      type: 'success',
      duration: 5000
    })
  } catch (err) {
    notification.notify({
      title: "Ajout d'une carte",
      text: `Une erreur est survenue`,
      type: 'error',
      duration: 5000
    })
  }
}

/**
 * Gère le changement de titre de la liste (lors du clic sur "Enter")
 * @param event Événement
 */
const handleListTitleChanged = (event: any) => {
  // Émettre l'événement
  emit('updateListTitle', props._id, event.srcElement.innerText)

  // Retirer focus
  event.srcElement.blur()
}

/**
 * Remet le titre de la liste à sa valeur initiale (lors du clic sur "Escape")
 * @param event Événement
 */
const resetListTitle = (event: any) => {
  event.srcElement.innerText = props.titre
}

// À chaque changement de filtres, récupérer les cartes de la liste à nouveau
watch(
  () => props.cardsFilters,
  () => {
    handleFetchCards()
  },
  { deep: true }
)

onMounted(() => {
  // Récupérer les cartes de la liste au chargement du composant
  handleFetchCards()
})
</script>

<template>
  <div class="list">
    <!-- Header -->
    <div class="list__header">
      <RemoveIcon
        tabindex="3"
        class="icon list--icon--delete"
        @click="emit('deleteList', props._id)"
      />
      <h2
        @keyup.enter="handleListTitleChanged($event)"
        @keyup.escape="resetListTitle($event)"
        @blur="resetListTitle($event)"
        ref="listTitle"
        class="content-editable"
        contenteditable="true"
        spellcheck="false"
      >
        {{ props.titre }}
      </h2>
    </div>

    <!-- Contenu -->
    <ul class="list__content">
      <li v-for="card in cards.cards">
        <Carte
          :key="card._id"
          :_id="card._id"
          :titre="card.titre"
          :description="card.description"
          :dateLimite="card.dateLimite"
          :liste="props._id"
          :boardId="props.tableau"
        />
      </li>
    </ul>

    <!-- Section ajout carte -->
    <div class="list__footer">
      <div v-if="showAddCardElement === false">
        <button class="button--primary" @click="showAddCardElement = !showAddCardElement">
          Ajouter
        </button>
      </div>

      <div v-else>
        <form v-on:submit.prevent="handleAddCard" class="element-add-new-card">
          <label>
            <input
              maxlength="50"
              autofocus="true"
              type="text"
              placeholder="Nom de la carte..."
              autocomplete="off"
              v-model="newCardTitle"
              @keyup.escape="showAddCardElement = false"
            />
          </label>

          <div>
            <button class="button--primary">Ajouter carte</button>
            <RemoveIcon class="icon" @click="showAddCardElement = false" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  margin: 0;
  word-break: break-all;
  padding-top: 0;
}

.list {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--header-height) - 10vh);
  padding: 1em;
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
}

/*
//////////////////////////////
// List header
//////////////////////////////
*/

.list__header {
  display: grid;
  grid-template-columns: 1fr 5fr;
  align-items: start;
  /* overflow-y: auto; */
  max-height: 10em;
  /* min-height: 3em; */
}

.list__header::-webkit-scrollbar {
  display: none;
}

/*
//////////////////////////////
// List content
//////////////////////////////
*/
.list__content {
  overflow-y: auto;
  padding: 0;
}

.list__content::-webkit-scrollbar {
  display: none;
}

/*
//////////////////////////////
// List footer
//////////////////////////////
*/
.list__footer {
  padding-top: 1em;
}

.list__footer > button {
  width: 100%;
}

/*
//////////////////////////////
// List icon
//////////////////////////////
*/
.list--icon--delete {
  width: 2.2em;
  height: 2.2em;
}

/*
//////////////////////////////
// Élément ajout carte
//////////////////////////////
*/

.list .element-add-new-card {
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
  padding: 1em;
  list-style: none;
  transition: all 1s ease-in-out;
}

.list .element-add-new-card div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
}

.list .element-add-new-card div svg {
  width: 2.2em;
  height: 2.2em;
}
</style>
