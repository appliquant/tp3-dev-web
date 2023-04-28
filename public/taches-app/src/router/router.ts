import InscriptionView from '@/views/auth/InscriptionView.vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
