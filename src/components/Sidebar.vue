<template>
  <v-navigation-drawer
    permanent
    :rail="rail"
    @click="rail = false"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://ui-avatars.com/api/?background=1976D2&color=fff&name=User"
        title="Menu"
        subtitle="Navigation"
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
        prepend-icon="mdi-credit-card-plus"
        title="Deposit"
        value="deposit"
        @click="$router.push('/deposit')"
        :active="$route.path === '/deposit'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-credit-card-minus"
        title="Withdraw"
        value="withdraw"
        @click="$router.push('/withdraw')"
        :active="$route.path === '/withdraw'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-bank-transfer"
        title="Transfer"
        value="transfer"
        @click="$router.push('/transfer')"
        :active="$route.path === '/transfer'"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-history"
        title="Transaction History"
        value="history"
        @click="$router.push('/history')"
        :active="$route.path === '/history'"
      ></v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          @click="handleLogout"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rail = ref(false)

const handleLogout = () => {
  // Add logout logic here later
  router.push('/login')
}
</script>
