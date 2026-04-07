<template>
  <main class="auth-page">
    <section class="auth-shell">
      <section class="auth-panel auth-panel-form">
        <div class="form-wrap">
          <div class="brand-row">
            <span class="brand-text">Amazon Trip HelpDesk</span>
          </div>

          <div class="form-header">
            <p class="eyebrow">Cadastro</p>
            <h1>Crie sua conta</h1>
          </div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="field">
              <label for="register-name">Nome *</label>
              <input
                id="register-name"
                v-model="name"
                type="text"
                placeholder="Seu nome"
                required
              />
            </div>

            <div class="field">
              <label for="register-email">E-mail *</label>
              <input
                id="register-email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div class="field">
              <label for="register-password">Senha *</label>
              <input
                id="register-password"
                v-model="password"
                type="password"
                placeholder="Crie uma senha"
                required
              />
            </div>

            <p v-if="error" class="feedback error">{{ error }}</p>

            <button type="submit" :disabled="loading" class="primary-button">
              {{ loading ? "Cadastrando..." : "Cadastrar" }}
            </button>
          </form>

          <RouterLink class="secondary-button" to="/login">Já tenho conta</RouterLink>
        </div>
      </section>

      <AuthBrandPanel />
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import AuthBrandPanel from "@/components/shared/AuthBrandPanel.vue"

const router = useRouter()
const auth = useAuthStore()

const name = ref("")
const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

async function handleRegister() {
  error.value = ""
  loading.value = true

  try {
    await auth.register(name.value, email.value, password.value)
    router.push("/login")
  } catch (e) {
    error.value = "Erro ao cadastrar. Verifique os dados e tente novamente."
  } finally {
    loading.value = false
  }
}
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

.form-wrap {
  width: min(100%, 22rem);
  display: grid;
  gap: 1.6rem;
}

.brand-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  color: #0bb986;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #66758a;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.form-header h1 {
  margin: 0;
  color: #1d2f4d;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.02;
}

.auth-form {
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

label {
  color: #27354b;
  font-size: 0.95rem;
  font-weight: 700;
}

input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #cbd7e4;
  border-radius: 0.75rem;
  background: #fff;
  color: #17212b;
  padding: 0.95rem 1rem;
  font: inherit;
}

input:focus {
  outline: 2px solid rgba(11, 185, 134, 0.18);
  border-color: #83d8be;
}

.feedback {
  margin: 0;
  padding: 0.8rem 0.95rem;
  border-radius: 1rem;
  font-weight: 600;
}

.error {
  background: #ffe9e7;
  color: #a13f34;
}

.primary-button,
.secondary-button {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 3.5rem;
  border: 0;
  border-radius: 999px;
  padding: 1rem 1.2rem;
  line-height: 1;
  font: inherit;
  font-weight: 700;
  text-decoration: none;
}

.primary-button {
  background: #202d42;
  color: #fff;
  cursor: pointer;
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.secondary-button {
  background: #eef2f7;
  color: #202d42;
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

  .form-wrap {
    width: 100%;
  }
}
</style>
