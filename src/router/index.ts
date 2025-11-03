import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '../components/RegisterPage.vue'
import DepositPage from '../components/DepositPage.vue'
import LoginPage from '../components/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
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
