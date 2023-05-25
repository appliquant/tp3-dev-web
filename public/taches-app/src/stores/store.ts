import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { PropsCarte } from '@/props/PropsCarte'

const MAIN_STORE_KEY = 'main'
const JWT_LOCAL_STORAGE_KEY = 'jwt'
const API_URL = import.meta.env.VITE_API_URL

export const useTableauStore = defineStore(MAIN_STORE_KEY, () => {
  /**
   * Retourne le JWT
   * @returns JWT
   */
  const getJwt = () => localStorage.getItem(JWT_LOCAL_STORAGE_KEY)

  /**
   * Définit le JWT dans le local storageconst getJwt = computed(() => {
    return localStorage.getItem(JWT_LOCAL_STORAGE_KEY)
  })
   * @param newJwt Nouveau JWT
   */
  const setJwt = (newJwt: string) => {
    localStorage.setItem(JWT_LOCAL_STORAGE_KEY, newJwt)
  }

  /**
   * Suppression d'une carte sans confirmation. Utilisé pour drag and drop
   * @param boardId Id du tableau
   * @param listId Id de la liste
   * @param cardId Id de la carte
   */
  const handleDeleteCardNoConfirmation = async (
    boardId: string,
    listId: string,
    cardId: string
  ) => {
    try {
      // Trouver jwt
      const jwt = getJwt()
      if (!jwt) {
        throw new Error('')
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
        `${API_URL}/tableaux/${boardId}/listes/${listId}/cartes/${cardId}`,
        params
      )
      const response = await req.json()

      // Si erreur
      if (!req.ok) {
        throw new Error(response.message)
      }

      return true
    } catch (err) {
      throw new Error(err as string)
    }
  }

  /**
   * Ajouter une carte dans une liste. Utilisé pour drag and drop
   * @param card Carte à ajouter
   * @param boardId Id du tableau
   * @param listId Id de la liste
   **/
  const handleAddCardDragDrop = async (card: PropsCarte, boardId: string, listId: string) => {
    try {
      // Validations
      if (card.titre.trim().length < 1) {
        return alert('Le titre de la carte ne peut pas être vide')
      }

      // Trouver jwt
      const jwt = getJwt()
      if (!jwt) {
        throw new Error()
      }

      // Carte à ajouter
      const newCard = {
        ...card,
        dateLimite: card.dateLimite ? card.dateLimite : 'null'
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
      const req = await fetch(`${API_URL}/tableaux/${boardId}/listes/${listId}/cartes`, params)
      const response = await req.json()

      // Vérifier s'il y a une erreur
      if (!req.ok) {
        if (req.status === 401) {
          throw new Error()
        }
      }

      const createdCard: PropsCarte = {
        _id: response.id!,
        titre: newCard.titre,
        description: newCard.description,
        // @ts-ignore
        dateLimite: newCard.dateLimite === 'null' ? null : newCard.dateLimite
      }

      return createdCard
    } catch (err) {
      throw new Error(err as string)
    }
  }

  /**
   * Reset le store
   */
  const $reset = () => {
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY)
  }

  return { getJwt, setJwt, $reset, handleDeleteCardNoConfirmation, handleAddCardDragDrop }
})
