/**
 * Represente un tableau
 */
export interface PropsTableau {
  /**
   * Identifiant du tableau
   */
  _id: string

  /**
   * Titre du tableau
   */
  titre: string

  /**
   * Id du proprietaire du tableau
   */
  proprietaire: string

  /**
   * Liste des identifiants des listes du tableau
   */
  listes: []
}
