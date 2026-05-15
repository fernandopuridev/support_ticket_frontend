<template>
  <p v-if="message" class="feedback" :class="variant">{{ message }}</p>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ""
  },
  variant: {
    type: String,
    default: "error"
  }
})
</script>

<style scoped>
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

.success {
  background: #e8f7f0;
  color: #1f7f5d;
}
</style>
