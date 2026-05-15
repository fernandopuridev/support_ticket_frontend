<template>
  <main class="auth-page">
    <section class="auth-shell">
      <section class="auth-panel auth-panel-form">
        <slot />
      </section>

      <AuthBrandPanel />
    </section>
  </main>
</template>

<script setup>
import AuthBrandPanel from "@/components/shared/AuthBrandPanel.vue"
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #f8fafc;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.08fr 1fr;
}

.auth-panel {
  min-width: 0;
}

.auth-panel-form {
  display: grid;
  place-items: center;
  padding: 2rem;
  background: #fbfcfd;
}

@media (max-width: 980px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-panel-form {
    padding: 1.5rem;
  }
}
</style>
