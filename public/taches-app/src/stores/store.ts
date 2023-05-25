import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MAIN_STORE_KEY = 'main'
const JWT_LOCAL_STORAGE_KEY = 'jwt'

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
   * Reset le store
   */
  const $reset = () => {
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY)
  }

  return { getJwt, setJwt, $reset }
})
