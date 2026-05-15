<template>
  <AuthPageLayout>
    <AuthFormShell
      :eyebrow="t('auth.login.eyebrow')"
      :title="t('auth.login.title')"
      :secondary-label="t('auth.login.secondaryAction')"
      secondary-to="/register"
    >
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="field">
          <label for="login-email">{{ t("auth.login.emailLabel") }}</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            :placeholder="t('auth.login.emailPlaceholder')"
            required
          />
        </div>

        <div class="field">
          <label for="login-password">{{ t("auth.login.passwordLabel") }}</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            :placeholder="t('auth.login.passwordPlaceholder')"
            required
          />
        </div>

        <div class="form-meta">
          <label class="remember-me">
            <input type="checkbox" />
            <span>{{ t("auth.login.rememberMe") }}</span>
          </label>
          <RouterLink to="/forgot-password" class="meta-link">
            {{ t("auth.login.forgotPassword") }}
          </RouterLink>
        </div>

        <AuthFeedback :message="error" variant="error" />

        <button type="submit" :disabled="loading" class="primary-button">
          {{ loading ? t("auth.login.submitting") : t("auth.login.submit") }}
        </button>
      </form>
    </AuthFormShell>
  </AuthPageLayout>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { useAuthStore } from "@/stores/authStore"
import AuthFeedback from "@/components/auth/AuthFeedback.vue"
import AuthFormShell from "@/components/auth/AuthFormShell.vue"
import AuthPageLayout from "@/components/auth/AuthPageLayout.vue"

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

async function handleLogin() {
  error.value = ""
  loading.value = true

  try {
    await auth.login(email.value, password.value)
    router.push("/tickets")
  } catch (e) {
    error.value = t("auth.login.error")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: #27354b;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.remember-me input {
  width: 1rem;
  height: 1rem;
  margin: 0;
}

.meta-link {
  color: #0bb986;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 640px) {
  .form-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
