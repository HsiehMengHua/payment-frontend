<template>
  <v-card class="mb-4" elevation="2">
    <v-card-text class="pa-4">
      <div v-if="loading" class="text-center">
        <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
      </div>

      <div v-else-if="user" class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-circle" size="large" class="mr-3 text-primary"></v-icon>
          <div>
            <div class="text-caption text-medium-emphasis">Welcome back</div>
            <div class="text-h6 font-weight-bold">{{ user.username }}</div>
          </div>
        </div>

        <div class="text-right">
          <div class="text-caption text-medium-emphasis">Balance</div>
          <div class="text-h6 font-weight-bold text-success">
            ${{ formatBalance(user.balance) }}
          </div>
        </div>
      </div>

      <v-alert v-else-if="error" type="error" variant="tonal" density="compact">
        {{ error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  username: string
  balance: number
}

const loading = ref(false)
const error = ref('')
const user = ref<User | null>(null)

const fetchUserData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/current`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user information')
    }

    const data = await response.json()
    user.value = data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load user information'
  } finally {
    loading.value = false
  }
}

const formatBalance = (balance: number): string => {
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

onMounted(() => {
  fetchUserData()
})
</script>
