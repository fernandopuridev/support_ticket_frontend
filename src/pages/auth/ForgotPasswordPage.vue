<template>
  <AuthPageLayout>
    <AuthFormShell
      :eyebrow="t('auth.forgotPassword.eyebrow')"
      :title="t('auth.forgotPassword.title')"
      :secondary-label="t('auth.forgotPassword.secondaryAction')"
      secondary-to="/login"
    >
      <AuthFeedback v-if="success" :message="t('auth.forgotPassword.success')" variant="success" />

      <form v-else class="auth-form" @submit.prevent="handleSubmit">
        <div class="field">
          <label for="forgot-email">{{ t("auth.forgotPassword.emailLabel") }}</label>
          <input
            id="forgot-email"
            v-model="email"
            type="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            required
          />
        </div>

        <AuthFeedback :message="error" variant="error" />

        <button type="submit" :disabled="loading" class="primary-button">
          {{ loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit") }}
        </button>
      </form>
    </AuthFormShell>
  </AuthPageLayout>
</template>

<script setup>
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import api from "@/services/api"
import AuthFeedback from "@/components/auth/AuthFeedback.vue"
import AuthFormShell from "@/components/auth/AuthFormShell.vue"
import AuthPageLayout from "@/components/auth/AuthPageLayout.vue"

const { t } = useI18n()
const email = ref("")
const error = ref("")
const loading = ref(false)
const success = ref(false)

async function handleSubmit() {
  error.value = ""
  loading.value = true

  try {
    await api.post("/auth/password", {
      user: { email: email.value }
    })
    success.value = true
  } catch (e) {
    error.value = t("auth.forgotPassword.error")
  } finally {
    loading.value = false
  }
}
</script>
