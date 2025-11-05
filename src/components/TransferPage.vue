<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <UserHeader />

        <v-card elevation="8">
          <v-card-title class="text-h5 text-center py-6 bg-primary">
            Transfer
          </v-card-title>

          <v-card-text class="px-8 py-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="formData.recipientUsername"
                label="Recipient Username"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.amount"
                label="Amount"
                :rules="[rules.required, rules.positiveNumber]"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
                class="mb-4"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Transfer
              </v-btn>
            </v-form>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserHeader from './UserHeader.vue'

const valid = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  recipientUsername: '',
  amount: ''
})

const rules = {
  required: (value: string) => !!value || 'This field is required',
  positiveNumber: (value: string) => {
    const num = parseFloat(value)
    return (!isNaN(num) && num > 0) || 'Amount must be a positive number'
  }
}

const handleSubmit = async () => {
  if (!valid.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const uuid = crypto.randomUUID()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid,
        recipient_username: formData.value.recipientUsername,
        amount: parseFloat(formData.value.amount)
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Transfer failed: ${response.status}`)
    }

    successMessage.value = 'Transfer successful!'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during transfer'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
