import type { PropsListe } from './PropsListe'

/**
 * Represente une carte
 */
export interface PropsCarte {
  /**
   * Identifiant de la carte
   */
  _id: string

  /**
   * Titre de la carte
   */
  titre: string

  /**
   * Description de la carte
   */
  description: string

  /**
   * Date limite de la carte
   */
  dateLimite: Date | null

  /**
   * Liste parente de la carte (identifiant)
   * @see PropsListe
   */
  liste: string
}
