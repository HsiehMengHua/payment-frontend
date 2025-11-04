<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center py-6 bg-primary">
            Withdraw
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

              <div class="mb-4">
                <div class="text-subtitle-2 mb-3 font-weight-medium">Select Bank Account</div>

                <div v-if="loadingBankAccounts" class="text-center my-8">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </div>

                <v-radio-group
                  v-else
                  v-model="formData.bankAccount"
                  :rules="[rules.required]"
                  hide-details
                >
                  <v-card
                    v-for="account in bankAccounts"
                    :key="account.id"
                    class="mb-3 bank-account-card"
                    :class="{ 'selected-card': formData.bankAccount === account.id }"
                    @click="formData.bankAccount = account.id"
                    variant="outlined"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-start">
                        <v-radio
                          :value="account.id"
                          hide-details
                          class="mt-0 pt-0"
                        ></v-radio>
                        <div class="flex-grow-1 ml-3">
                          <div class="d-flex align-center mb-2">
                            <v-icon icon="mdi-bank" size="small" class="mr-2 text-primary"></v-icon>
                            <span class="font-weight-bold text-body-1">{{ account.BankName }}</span>
                          </div>
                          <div class="text-body-2 mb-1">
                            <span class="text-medium-emphasis">Bank Code:</span>
                            <span class="font-weight-medium ml-1">{{ account.BankCode }}</span>
                          </div>
                          <div class="text-body-2">
                            <span class="text-medium-emphasis">Account Number:</span>
                            <span class="font-weight-medium ml-1">{{ account.AccountNumber }}</span>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-radio-group>
              </div>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Withdraw
              </v-btn>
            </v-form>

            <v-alert
              v-if="!loadingBankAccounts && bankAccounts.length === 0"
              type="info"
              variant="tonal"
              class="mt-4"
            >
              No bank accounts found. Please add a bank account first.
            </v-alert>

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
                @click="$router.push('/deposit')"
              >
                Go to Deposit
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const valid = ref(false)
const loading = ref(false)
const loadingBankAccounts = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const bankAccounts = ref<any[]>([])

const formData = ref({
  amount: '',
  bankAccount: ''
})

const rules = {
  required: (value: string | number) => !!value || 'This field is required',
  positiveNumber: (value: string) => {
    const num = parseFloat(value)
    return (!isNaN(num) && num > 0) || 'Amount must be a positive number'
  }
}

const fetchBankAccounts = async () => {
  loadingBankAccounts.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bank-accounts/user`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch bank accounts')
    }

    const data = await response.json()
    bankAccounts.value = data
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load bank accounts'
  } finally {
    loadingBankAccounts.value = false
  }
}

onMounted(() => {
  fetchBankAccounts()
})

const handleSubmit = async () => {
  if (!valid.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const uuid = crypto.randomUUID()

    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid,
        amount: parseFloat(formData.value.amount),
        bank_account_id: formData.value.bankAccount
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Withdraw failed: ${response.status}`)
    }

    successMessage.value = 'Withdraw successful!'

    // Reset form
    formData.value = {
      amount: '',
      bankAccount: ''
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during withdraw'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.bank-account-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.bank-account-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.selected-card {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 2px !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}
</style>
