import type { PropsTableau } from './PropTableau'

/**
 * Represente une liste
 */
export interface PropsListe {
  /**
   * Identifiant de la liste
   */
  _id: string

  /**
   * Titre de la liste
   */
  titre: string

  /**
   * Tableau parent (identifiant)
   * @see PropsTableau
   */
  tableau: string
}
