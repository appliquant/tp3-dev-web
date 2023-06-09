import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/inscription',
    name: 'inscription',
    component: () => import('../views/auth/InscriptionView.vue')
  },

  {
    path: '/connexion',
    name: 'connexion',
    component: () => import('../views/auth/ConnexionView.vue')
  },

  {
    path: '/tableaux',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue')
  },

  {
    path: '/tableaux/:tableauId',
    name: 'tableau',
    component: () => import('@/views/TableauView.vue')
  },

  // Erreur 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/Erreur404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
