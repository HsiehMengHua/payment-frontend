<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center py-6 bg-primary">
            Deposit
          </v-card-title>

          <v-card-text class="px-8 py-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="formData.amount"
                label="Amount"
                :rules="[rules.required, rules.positiveNumber]"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
                class="mb-2"
                required
              ></v-text-field>

              <v-select
                v-model="formData.paymentMethod"
                label="Payment Method"
                :rules="[rules.required]"
                :items="paymentMethods"
                variant="outlined"
                prepend-inner-icon="mdi-credit-card"
                class="mb-4"
                required
              ></v-select>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Deposit
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

            <v-divider class="my-4"></v-divider>

            <div class="d-flex flex-column ga-2">
              <v-btn
                variant="text"
                color="primary"
                block
                @click="$router.push('/login')"
              >
                Go to Login
              </v-btn>
              <v-btn
                variant="text"
                color="primary"
                block
                @click="$router.push('/register')"
              >
                Go to Register
              </v-btn>
              <v-btn
                variant="text"
                color="primary"
                block
                @click="$router.push('/withdraw')"
              >
                Go to Withdraw
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const valid = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  amount: '',
  paymentMethod: ''
})

const paymentMethods = [
  'FakePay'
]

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

    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid,
        amount: parseFloat(formData.value.amount),
        payment_method: formData.value.paymentMethod
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Deposit failed: ${response.status}`)
    }

    const data = await response.json()
    successMessage.value = 'Deposit successful!'

    setTimeout(() => {
      window.open(data.redirect_url, '_blank')
      loading.value = false
    }, 1000)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during deposit'
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
