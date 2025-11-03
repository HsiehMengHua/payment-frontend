import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '../components/RegisterPage.vue'
import DepositPage from '../components/DepositPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/register'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: DepositPage
    }
  ]
})

export default router
