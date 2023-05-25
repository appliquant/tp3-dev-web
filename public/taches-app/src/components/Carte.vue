<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

import { useTableauStore } from '@/stores/store'
import { useNotification } from '@kyvg/vue3-notification'

import RemoveIcon from '@/components/icons/RemoveIcon.vue'
import ModalCarte from '@/components/ModalCarte.vue'
import type { PropsCarte } from '@/props/PropsCarte'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()
const store = useTableauStore()
const notification = useNotification()

const emit = defineEmits<{
  /**
   * Événement lorsqu'une carte est modifiée
   * Utilisé dans le composant Liste.vue pour rafrachir la liste des cartes
   */
  (e: 'card-updated'): void

  /**
   * Événement lorsqu'une carte est supprimée
   * Utilisé dans le composant Liste.vue pour rafrachir la liste des cartes
   */
  (e: 'card-deleted'): void
}>()

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
 * Retourne date formaté pour le champ date de l'input.
 * yyyy-mm-ddThh:mm
 */
const date = computed({
  // @ts-ignore
  get() {
    if (!tempCard.dateLimite) {
      return
    }

    const year = tempCard.dateLimite.getFullYear().toString()
    let month = (tempCard.dateLimite.getMonth() + 1).toString()
    if (month.length < 2) {
      month = '0' + month
    }

    let day = tempCard.dateLimite.getDate().toString()
    if (day.length < 2) {
      day = '0' + day
    }

    let hours = tempCard.dateLimite.getHours().toString()
    if (hours.length < 2) {
      hours = '0' + hours
    }

    let minutes = tempCard.dateLimite.getMinutes().toString()
    if (minutes.length < 2) {
      minutes = '0' + minutes
    }

    return `${year}-${month}-${day}T${hours}:${minutes}`
  },
  set(newDate: Date) {
    const date = new Date(newDate)
    tempCard.dateLimite = date
  }
})

/**
 * Retourne la classe que doit avoir la date de la carte
 * Rouge : date dépassée
 * Jaune : date dans moins de 24h
 * Verte : date dans plus de 24h
 */
const dateStyle = computed(() => {
  if (!props.dateLimite) {
    return
  }

  const dateLimite = props.dateLimite
  const today = new Date()

  // Différence entre les dates en heures. 1000ms * 60 = 1s * 60 = 1h
  const diff = Math.abs((dateLimite.getTime() - today.getTime()) / (1000 * 60 * 60))

  // Si date dépassée
  if (dateLimite < today) {
    return 'badge--red'
  }

  // Si c'est dans moins de 24 heures
  if (diff < 24) {
    return 'badge--yellow'
  }

  return 'badge--green'
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

    // Émettre l'événement
    emit('card-updated')

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

/**
 * Suppression d'une carte
 */
const handleDeleteCard = async () => {
  try {
    // Confirmation
    const conf = confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')
    if (!conf) {
      return
    }

    // Trouver jwt
    const jwt = store.getJwt()
    if (!jwt) {
      return redirectToLoginPage()
    }

    // Paramètres de la requête
    const params = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${jwt}`
      }
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
        title: 'Erreur lors de la suppression de la carte',
        text: `Une erreur est survenue : ${response.message}`,
        type: 'error'
      })
    }

    // Fermer le modal
    showModal.value = false

    // Émettre un événement que la carte a été supprimée
    emit('card-deleted')

    // Notification succès
    return notification.notify({
      title: 'Succès',
      text: 'La carte a été supprimée avec succès',
      type: 'success'
    })
  } catch (err) {
    return notification.notify({
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la suppression de la carte',
      type: 'error'
    })
  }
}
</script>

<template>
  <!-- Contenu -->
  <div class="container" @click="showModal = true">
    <div>
      <p>{{ props.titre }}</p>
      <p :class="`badge ${dateStyle}`">{{ props.dateLimite?.toLocaleDateString() }}</p>
    </div>
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
        {{ tempCard.dateLimite }}

        <form @submit.prevent="handleUpdateCard">
          <label for="date">
            <h3>Date limite</h3>
          </label>

          <input v-model="date" id="date" type="datetime-local" />

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

          <div class="form-button-section">
            <button class="button--danger" @click.prevent="handleDeleteCard">Supprimer</button>
            <button class="button--primary">Modifier</button>
          </div>
        </form>
      </template>
    </ModalCarte>
  </Teleport>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;

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

.form-button-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1em;
}
</style>
