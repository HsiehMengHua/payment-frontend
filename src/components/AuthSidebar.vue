<template>
  <v-navigation-drawer
    permanent
    :rail="rail"
    @click="rail = false"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://ui-avatars.com/api/?background=1976D2&color=fff&name=Auth"
        title="Welcome"
        subtitle="Authentication"
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-login"
        title="Login"
        value="login"
        @click="$router.push('/login')"
        :active="$route.path === '/login'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-account-plus"
        title="Register"
        value="register"
        @click="$router.push('/register')"
        :active="$route.path === '/register'"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rail = ref(false)
</script>
