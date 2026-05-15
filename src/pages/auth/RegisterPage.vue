<template>
  <AuthPageLayout>
    <AuthFormShell
      :eyebrow="t('auth.register.eyebrow')"
      :title="t('auth.register.title')"
      :secondary-label="t('auth.register.secondaryAction')"
      secondary-to="/login"
    >
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="field">
          <label for="register-name">{{ t("auth.register.nameLabel") }}</label>
          <input
            id="register-name"
            v-model="name"
            type="text"
            :placeholder="t('auth.register.namePlaceholder')"
            required
          />
        </div>

        <div class="field">
          <label for="register-email">{{ t("auth.register.emailLabel") }}</label>
          <input
            id="register-email"
            v-model="email"
            type="email"
            :placeholder="t('auth.register.emailPlaceholder')"
            required
          />
        </div>

        <div class="field">
          <label for="register-password">{{ t("auth.register.passwordLabel") }}</label>
          <input
            id="register-password"
            v-model="password"
            type="password"
            :placeholder="t('auth.register.passwordPlaceholder')"
            required
          />
        </div>

        <AuthFeedback :message="error" variant="error" />

        <button type="submit" :disabled="loading" class="primary-button">
          {{ loading ? t("auth.register.submitting") : t("auth.register.submit") }}
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
    error.value = t("auth.register.error")
  } finally {
    loading.value = false
  }
}
</script>
