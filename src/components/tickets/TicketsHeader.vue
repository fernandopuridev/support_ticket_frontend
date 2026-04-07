<template>
  <header class="tickets-header">
    <div class="brand">
      <div>
        <p class="brand-label">Amazon Trip Helpdesk</p>
        <h1>Seus Chamados</h1>
      </div>
    </div>

    <div class="header-actions">
      <div class="user-info">
        <div class="avatar">{{ userInitial }}</div>
        <span class="user-name">{{ auth.user?.name }}</span>
      </div>
      <button class="secondary-button" @click="$emit('logout')">Sair</button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue"
import { useAuthStore } from "@/stores/authStore"

defineEmits(["logout"])

const auth = useAuthStore()
const userInitial = computed(() => auth.user?.name?.charAt(0).toUpperCase() || "?")
</script>

<style scoped>
.tickets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-label {
  margin: 0 0 0.25rem;
  color: #0bb986;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #17212b;
  font-size: clamp(1.6rem, 2vw, 2rem);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #202d42, #314150);
  color: #fff;
  font-weight: 800;
  font-size: 0.9rem;
}

.user-name {
  color: #314150;
  font-weight: 700;
  font-size: 0.95rem;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1.1rem;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.secondary-button {
  background: #eff4f8;
  color: #314150;
}

@media (max-width: 720px) {
  .tickets-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }
}
</style>
