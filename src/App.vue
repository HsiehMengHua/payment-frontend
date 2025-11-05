<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import AuthSidebar from './components/AuthSidebar.vue'

const route = useRoute()

const showAuthSidebar = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

const showSidebar = computed(() => {
  const authenticatedRoutes = ['/deposit', '/withdraw', '/transfer', '/history']
  return authenticatedRoutes.includes(route.path)
})
</script>

<template>
  <v-app>
    <AuthSidebar v-if="showAuthSidebar" />
    <Sidebar v-else-if="showSidebar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
