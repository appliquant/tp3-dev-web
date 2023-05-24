/**
 * Represente les filtres de recherche de cartes
 */
export interface PropsFiltres {
  /**
   * Aucun filtre
   */
  none: boolean

  /**
   * Filtrer les cartes qui se terminent demain
   */
  tomorrow: boolean

  /**
   * Filtrer les cartes en retard (après aujourd'hui)
   */
  late: boolean
}
