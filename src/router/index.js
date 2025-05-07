import { createRouter, createWebHistory } from 'vue-router'
import CardsView from '../views/CardsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/cards'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/cards',
    name: 'Cards',
    component: CardsView
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('../views/PaymentsView.vue')
  },
  {
    path: '/credit',
    name: 'Credit',
    component: () => import('../views/CreditView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router