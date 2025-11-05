<template>
  <v-container class="fill-height">
    <v-row justify="center" align="start">
      <v-col cols="12" lg="10" xl="8">
        <UserHeader />

        <v-card elevation="8">
          <v-card-title class="text-h5 py-6 bg-primary">
            <div class="d-flex align-center justify-space-between">
              <span>Transaction History</span>
              <v-icon icon="mdi-history"></v-icon>
            </div>
          </v-card-title>

          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="transactions"
              :loading="loading"
              :items-per-page="itemsPerPage"
              :page="page"
              :server-items-length="totalItems"
              @update:page="handlePageChange"
              @update:items-per-page="handleItemsPerPageChange"
              class="elevation-0"
            >
              <template v-slot:item.type="{ item }">
                <v-chip
                  :color="getTypeColor(item.type)"
                  size="small"
                  variant="flat"
                >
                  {{ item.type }}
                </v-chip>
              </template>

              <template v-slot:item.amount="{ item }">
                <span :class="getAmountClass(item.type)">
                  {{ formatAmount(item.amount, item.type) }}
                </span>
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  variant="tonal"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:item.created_at="{ item }">
                {{ formatDate(item.created_at) }}
              </template>

              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>

              <template v-slot:no-data>
                <v-alert type="info" variant="tonal" class="ma-4">
                  No transactions found
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserHeader from './UserHeader.vue'

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  description: string
  created_at: string
}

const loading = ref(false)
const transactions = ref<Transaction[]>([])
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const headers = [
  { title: 'ID', key: 'uuid', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Amount', key: 'amount', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Payment Method', key: 'payment_method', sortable: false },
  { title: 'Date', key: 'created_at', sortable: false },
]

const fetchTransactions = async () => {
  loading.value = true

  try {
    // Placeholder API - will be replaced later
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/transactions/user`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const data = await response.json()
    transactions.value = data || []

    // not yet implement pagination on backend
    // transactions.value = data.transactions || []
    // totalItems.value = data.total || 0
  } catch (error) {
    console.error('Error fetching transactions:', error)
    transactions.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchTransactions()
}

const handleItemsPerPageChange = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage
  page.value = 1
  fetchTransactions()
}

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    deposit: 'success',
    withdraw: 'warning',
    transfer: 'info',
  }
  return colors[type.toLowerCase()] || 'grey'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
    cancelled: 'grey',
  }
  return colors[status.toLowerCase()] || 'grey'
}

const getAmountClass = (type: string): string => {
  if (type.toLowerCase() === 'deposit') {
    return 'text-success font-weight-bold'
  } else if (type.toLowerCase() === 'withdraw' || type.toLowerCase() === 'transfer') {
    return 'text-error font-weight-bold'
  }
  return 'font-weight-bold'
}

const formatAmount = (amount: number, type: string): string => {
  const prefix = type.toLowerCase() === 'deposit' ? '+' : '-'
  return `${prefix}$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
