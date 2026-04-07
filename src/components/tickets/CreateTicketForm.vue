<template>
  <form class="ticket-form" @submit.prevent="handleSubmit">
    <div class="form-header">
      <div>
        <p class="eyebrow">Novo chamado</p>
        <h2>Abrir atendimento</h2>
      </div>
      <span class="status-chip">Preencha os campos</span>
    </div>
    <div class="form-grid">
      <div class="field field-full">
        <label for="ticket-title">Título</label>
        <input id="ticket-title" v-model="form.title" type="text" required />
      </div>
      <div class="field field-full">
        <label for="ticket-description">Descrição</label>
        <textarea id="ticket-description" v-model="form.description" required></textarea>
      </div>
      <div class="field">
        <label for="ticket-category">Categoria</label>
        <select id="ticket-category" v-model="form.category" required>
          <option value="reservation">Reserva</option>
          <option value="payment">Pagamento</option>
          <option value="cancellation">Cancelamento</option>
          <option value="information">Informacoes</option>
          <option value="technical">Problema tecnico</option>
          <option value="other">Outros</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button type="submit" :disabled="loading">
        {{ loading ? "Enviando..." : "Abrir Chamado" }}
      </button>
    </div>
  </form>
</template>
<script setup>
import { reactive } from "vue"
defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(["submit"])
const form = reactive({
  title: "",
  description: "",
  category: ""
})
function handleSubmit() {
  emit("submit", { ...form })
}
</script>
<style scoped>
.ticket-form {
  display: grid;
  gap: 1.25rem;
  padding: 1.4rem;
  border: 1px solid rgba(189, 205, 218, 0.75);
  border-radius: 1.4rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 248, 251, 0.96));
  box-shadow: 0 16px 40px rgba(29, 48, 66, 0.08);
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}
.eyebrow {
  margin: 0 0 0.25rem;
  color: #5f6f7d;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
h2 {
  margin: 0;
  color: #17212b;
  font-size: 1.15rem;
}
.status-chip {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  background: #eef7f3;
  color: #1f7f5d;
  font-size: 0.8rem;
  font-weight: 700;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.field {
  display: grid;
  gap: 0.45rem;
}
.field-full {
  grid-column: 1 / -1;
}
label {
  color: #314150;
  font-size: 0.9rem;
  font-weight: 700;
}
input,
textarea,
select {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  border: 1px solid #cfdae4;
  border-radius: 0.95rem;
  background: #fff;
  color: #17212b;
  padding: 0.85rem 1rem;
  font: inherit;
}
textarea {
  min-height: 7rem;
  resize: vertical;
}
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid rgba(45, 155, 117, 0.18);
  border-color: #73c5a5;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
}
button {
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1.25rem;
  background: linear-gradient(135deg, #2d9b75, #1f7f5d);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(31, 127, 93, 0.2);
}
button:disabled {
  cursor: wait;
  opacity: 0.7;
}
@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
