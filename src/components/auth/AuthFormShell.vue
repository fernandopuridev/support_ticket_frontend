<template>
  <div class="form-wrap">
    <div class="brand-row">
      <span class="brand-text">{{ t("common.appName") }}</span>
    </div>

    <div class="form-header">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
    </div>

    <slot />

    <RouterLink class="secondary-button" :to="secondaryTo">{{ secondaryLabel }}</RouterLink>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

defineProps({
  eyebrow: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  secondaryLabel: {
    type: String,
    required: true
  },
  secondaryTo: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
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

:deep(.auth-form) {
  display: grid;
  gap: 1rem;
}

:deep(.field) {
  display: grid;
  gap: 0.45rem;
}

:deep(label) {
  color: #27354b;
  font-size: 0.95rem;
  font-weight: 700;
}

:deep(input) {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #cbd7e4;
  border-radius: 0.75rem;
  background: #fff;
  color: #17212b;
  padding: 0.95rem 1rem;
  font: inherit;
}

:deep(input:focus) {
  outline: 2px solid rgba(11, 185, 134, 0.18);
  border-color: #83d8be;
}

:deep(.primary-button),
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

:deep(.primary-button) {
  background: #202d42;
  color: #fff;
  cursor: pointer;
}

:deep(.primary-button:disabled) {
  cursor: wait;
  opacity: 0.7;
}

.secondary-button {
  background: #eef2f7;
  color: #202d42;
}

@media (max-width: 640px) {
  .form-wrap {
    width: 100%;
  }

  :deep(.form-meta) {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
