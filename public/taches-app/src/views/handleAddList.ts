import {
  newListTitle,
  store,
  redirectToLoginPage,
  tableauId,
  API_URL,
  notification,
  boardData,
  showAddListElement
} from './TableauView.vue.js'

/**
 * Ajouter une liste dans la base de données
 */
export async function handleAddList() {
  try {
    // Validations
    console.log(newListTitle.value)
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
        titre: newListTitle.value,
        tableau: tableauId.value
      })
    }

    // Requête
    const req = await fetch(`${API_URL}/tableaux/${tableauId}/listes`, params)
    const response = await req.json()

    // Vérifier s'il y a une erreur
    if (!req.ok) {
      if (req.status === 401) {
        return redirectToLoginPage()
      } else if (req.status === 404) {
        return notification.notify({
          title: "Ajout d'une liste tableau",
          text: `Une erreur est survenue : ${response.message}`,
          type: 'error',
          duration: 5000
        })
      } else {
        return redirectToLoginPage()
      }
    }

    // Ajouter liste dans le tableau
    boardData.lists.push(response)

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
