<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useTableauStore } from '@/stores/store'
import { useNotification } from '@kyvg/vue3-notification'

import RemoveIcon from '@/components/icons/RemoveIcon.vue'
import ModalCarte from './ModalCarte.vue'
import type { PropsCarte } from '@/props/PropsCarte'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const store = useTableauStore()
const notification = useNotification()

/**
 * Props de la carte
 */
const props = defineProps<
  PropsCarte & {
    /**
     * Id du tableau
     */
    boardId: string
  }
>()

/**
 * Propriété qui affiche la date limite en format locale
 */
const cardDate = computed(() => {
  if (!props.dateLimite) {
    return
  }

  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(new Date(props.dateLimite))
})

/**
 * Afficher ou non le modal
 */
const showModal = ref(false)

/**
 * Carte temporaire pour sauvegarder les modifications
 */
const tempCard = reactive<PropsCarte>({
  ...props
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
 * Remet le titre de la carte à sa valeur initiale (lors du clic sur "Escape")
 * @param event Événement
 */
const resetCardTitle = (event: any) => {
  // Remettre le titre de la carte à sa valeur initiale
  event.srcElement.innerText = props.titre

  // Remettre le titre de la carte temporaire à sa valeur initiale
  tempCard.titre = props.titre
}

/**
 * Change le titre de la carte temporaire
 * @param event Événement
 */
const handleCardTitleChange = (event: any) => {
  // Assigner le nouveau titre à la carte temporaire
  tempCard.titre = event?.target?.innerText

  // Retirer focus
  event?.srcElement?.blur()
}

/**
 * Modification d'une carte
 */
const handleUpdateCard = async () => {
  try {
    // Validations
    if (tempCard.titre === '') {
      return notification.notify({
        title: 'Erreur',
        text: 'Le titre ne peut pas être vide',
        type: 'error'
      })
    }

    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    // Paramètres de la requête
    const params = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${jwt}`
      },
      body: JSON.stringify({
        ...tempCard,
        // Date sauvegardées en UTC (pour éviter le décalage horaire)
        dateLimite:
          tempCard.dateLimite === null ? 'null' : new Date(tempCard.dateLimite).toISOString()
      })
    }

    // Requête
    const req = await fetch(
      `${API_URL}/tableaux/${props.boardId}/listes/${props.liste}/cartes/${props._id}`,
      params
    )
    const response = await req.json()

    // Si erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage(response.message)
      }

      return notification.notify({
        title: 'Erreur lors de la modification de la carte',
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error'
      })
    }

    // Fermer le modal
    showModal.value = false

    // Notification succès
    return notification.notify({
      title: 'Succès',
      text: 'La carte a été modifiée avec succès',
      type: 'success'
    })
  } catch (err) {
    return notification.notify({
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la modification de la carte',
      type: 'error'
    })
  }
}
</script>

<template>
  <!-- Contenu -->
  <div class="container" @click="showModal = true">
    <p>{{ props.titre }}</p>
    <p>{{ cardDate }}</p>
  </div>

  <!-- Modal carte -->
  <Teleport to="body">
    <ModalCarte :card="props" :show="showModal">
      <!-- Header -->
      <template #header>
        <h2
          @keyup.enter="handleCardTitleChange($event)"
          @keyup.escape="resetCardTitle($event)"
          contenteditable
          spellcheck="false"
          class="content-editable"
        >
          {{ tempCard.titre }}
        </h2>
        <RemoveIcon class="icon icon--remove" @click="showModal = false" />
      </template>

      <!-- Body -->
      <template #body>
        <form @submit.prevent="handleUpdateCard">
          <label for="date">
            <h3>Date limite</h3>
          </label>

          <input
            :value="cardDate"
            @input="
              (event) => {
                // Assigner la nouvelle date à la carte temporaire
                // @ts-ignore
                tempCard.dateLimite = new Date(event?.target?.value)
              }
            "
            id="date"
            type="date"
          />

          <label for="description">
            <h3>Description</h3>
          </label>

          <textarea
            v-model="tempCard.description"
            id="description"
            maxlength="500"
            placeholder="Description..."
            >{{ props.description }}</textarea
          >

          <button class="button--primary">Modifier</button>
        </form>
      </template>
    </ModalCarte>
  </Teleport>
</template>

<style scoped>
.container {
  cursor: pointer;
  background-color: var(--color-gray-light);
  border-radius: 0.4em;
  padding: 1em;
  margin: 1em auto 1em auto;
  list-style: none;
}

.container:hover {
  opacity: 0.8;
}

.badge {
  display: inline-block;
  margin-bottom: 1em;
  padding: 0.15em 0.3em 0.15em 0.3em;
  border-radius: 0.25rem;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.badge--date {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}
</style>
