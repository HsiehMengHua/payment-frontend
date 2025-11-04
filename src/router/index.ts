import { createRouter, createWebHistory } from 'vue-router'
import RegisterPage from '../components/RegisterPage.vue'
import DepositPage from '../components/DepositPage.vue'
import LoginPage from '../components/LoginPage.vue'
import WithdrawPage from '../components/WithdrawPage.vue'
import TransferPage from '../components/TransferPage.vue'
import TransactionHistoryPage from '../components/TransactionHistoryPage.vue'

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
    },
    {
      path: '/withdraw',
      name: 'withdraw',
      component: WithdrawPage
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: TransferPage
    },
    {
      path: '/history',
      name: 'history',
      component: TransactionHistoryPage
    }
  ]
})

export default router
