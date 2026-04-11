<template>
  <main class="tickets-page">
    <div class="tickets-shell">
      <TicketsHeader @logout="handleLogout" />

      <CreateTicketForm v-if="showForm" :loading="loading" @submit="handleCreate" />

      <section class="filters-panel">
        <div class="filters-topline">
          <button type="button" class="new-ticket-button" @click="showForm = !showForm">
            {{ t("tickets.page.newTicket") }}
          </button>

          <div class="search-box">
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input
              v-model="searchTerm"
              type="search"
              :placeholder="t('tickets.page.searchPlaceholder')"
            />
          </div>
        </div>

        <div class="status-filters">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            type="button"
            class="filter-chip"
            :class="{ active: statusFilter === option.value }"
            @click="statusFilter = option.value"
          >
            {{ t(option.labelKey) }}
          </button>
        </div>
      </section>

      <p v-if="error" class="feedback error">{{ error }}</p>

      <div v-if="filteredTickets.length === 0" class="empty-state">
        <p>{{ t("tickets.page.empty") }}</p>
      </div>

      <TicketList v-else :tickets="filteredTickets" />
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import CreateTicketForm from "@/components/tickets/CreateTicketForm.vue"
import TicketList from "@/components/tickets/TicketList.vue"
import TicketsHeader from "@/components/tickets/TicketsHeader.vue"
import { useAuthStore } from "@/stores/authStore"
import { ticketService } from "@/services/ticketService"
import { TICKET_FILTER_OPTIONS } from "@/utils/constants"

const router = useRouter()
const { t } = useI18n()
const auth = useAuthStore()

const tickets = ref([])
const error = ref("")
const loading = ref(false)
const showForm = ref(false)
const searchTerm = ref("")
const statusFilter = ref("all")

const filterOptions = TICKET_FILTER_OPTIONS

const filteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    const matchesStatus = statusFilter.value === "all" || ticket.status === statusFilter.value
    const normalizedSearch = searchTerm.value.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch === "" ||
      ticket.title.toLowerCase().includes(normalizedSearch) ||
      ticket.description.toLowerCase().includes(normalizedSearch)

    return matchesStatus && matchesSearch
  })
})

onMounted(async () => {
  try {
    const response = await ticketService.getAll()
    tickets.value = response.data
  } catch (e) {
    error.value = t("tickets.page.loadError")
  }
})

async function handleCreate(ticketData) {
  error.value = ""
  loading.value = true

  try {
    await ticketService.create(ticketData)
    showForm.value = false
    const response = await ticketService.getAll()
    tickets.value = response.data
  } catch (e) {
    error.value = t("tickets.page.createError")
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  auth.logout()
  router.push("/login")
}
</script>

<style scoped>
.tickets-page {
  min-height: 100vh;
  padding: clamp(1.2rem, 2vw, 2rem);
  background:
    radial-gradient(circle at top left, rgba(170, 231, 206, 0.45), transparent 28%),
    linear-gradient(180deg, #f4f8fb 0%, #edf3f7 100%);
  display: grid;
  align-items: start;
  color: #17212b;
}

.tickets-shell {
  display: grid;
  gap: 1.25rem;
  width: min(100%, 76rem);
  margin-inline: auto;
  align-content: start;
}

/* 1. Altura reduzida (padding menor) */
.filters-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem; 
  padding: 1rem 1.25rem; /* Reduzido de 1.5rem para 1rem */
  border: 1px solid rgba(190, 203, 214, 0.8);
  border-radius: 1.3rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 34px rgba(28, 44, 60, 0.08);
}

.filters-topline {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.search-box {
  position: relative;
  flex: 1; /* Ocupa o restante do espaço ao lado do botão */
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #7a8a98;
}

.search-box input {
  width: 100%;
  border: 1px solid #d2dde6;
  border-radius: 999px;
  background: #fff;
  padding: 0.7rem 1rem 0.7rem 2.4rem; /* Padding interno menor */
  color: #17212b;
  font: inherit;
}

.search-box input:focus {
  outline: 2px solid rgba(45, 155, 117, 0.16);
  border-color: #82cdb0;
}

.status-filters {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.filter-chip {
  flex: 1; /* Força todos os botões a terem a mesma largura */
  text-align: center;
  border: 1px solid #d2dde6;
  border-radius: 999px;
  background: #fff;
  color: #4d5d6c;
  padding: 0.6rem 0.5rem; /* Padding vertical reduzido */
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.new-ticket-button {
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  background: linear-gradient(135deg, #2d9b75, #1f7f5d);
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(31, 127, 93, 0.18);
  white-space: nowrap;
}

.filter-chip.active {
  border-color: #1f7f5d;
  background: #e8f7f0;
  color: #1f7f5d;
}

.feedback {
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  font-weight: 600;
}

.error {
  background: #ffe9e7;
  color: #a13f34;
}

.empty-state {
  display: grid;
  place-items: center;
  min-height: 14rem;
  border: 1px dashed #c5d3dd;
  border-radius: 1.3rem;
  background: rgba(255, 255, 255, 0.72);
  color: #607181;
  text-align: center;
}

@media (max-width: 600px) {
  .filters-topline {
    flex-direction: column;
    align-items: stretch;
  }
  
  .status-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
