<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8">
          <v-card-title class="text-h5 text-center py-6 bg-primary">
            Register
          </v-card-title>

          <v-card-text class="px-8 py-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="formData.username"
                label="Username"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                label="Password"
                :rules="[rules.required, rules.minLength]"
                type="password"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.name"
                label="Name"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-account-circle"
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
                Register
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
import { ref } from 'vue'

const valid = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const formData = ref({
  username: '',
  password: '',
  name: ''
})

const rules = {
  required: (value: string) => !!value || 'This field is required',
  minLength: (value: string) => value.length >= 6 || 'Password must be at least 6 characters'
}

const handleSubmit = async () => {
  if (!valid.value) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Registration failed: ${response.status}`)
    }

    successMessage.value = 'Registration successful!'

    // Reset form
    formData.value = {
      username: '',
      password: '',
      name: ''
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'An error occurred during registration'
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
