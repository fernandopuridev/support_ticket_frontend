<template>
  <main class="ticket-detail-page">
    <section v-if="loadingTicket" class="state-card">
      <p>{{ t("tickets.detail.loading") }}</p>
    </section>

    <section v-else-if="pageError" class="state-card error-card">
      <p>{{ pageError }}</p>
      <RouterLink class="back-link" to="/tickets">{{ t("tickets.detail.backToTickets") }}</RouterLink>
    </section>

    <div v-else-if="ticket" class="ticket-detail-shell">
      <header class="detail-header">
        <div class="detail-header-left">
          <RouterLink class="back-link" to="/tickets">{{ t("tickets.detail.back") }}</RouterLink>
          <p class="eyebrow">{{ t("tickets.detail.number", { id: ticket.id }) }}</p>
          <h1>{{ ticket.title }}</h1>
          <p class="subtitle">
            {{ t("tickets.detail.openedBy", {
              name: ticket.user?.name || t("common.user"),
              date: formatDate(ticket.created_at, locale)
            }) }}
          </p>
        </div>

        <div class="header-badges">
          <span class="status-pill" :class="statusClass(ticket.status)">
            {{ translateTicketStatus(ticket.status) }}
          </span>
          <span class="category-pill">
            {{ translateTicketCategory(ticket.category) }}
          </span>
        </div>
      </header>

      <section class="detail-layout">
        <article class="detail-card overview-card">
          <div class="card-head">
            <div>
              <p class="eyebrow">{{ t("tickets.detail.overviewEyebrow") }}</p>
              <h2>{{ t("tickets.detail.overviewTitle") }}</h2>
            </div>

            <div v-if="auth.isAdmin" class="status-editor">
              <label for="ticket-status">{{ t("tickets.detail.statusLabel") }}</label>
              <select
                id="ticket-status"
                :value="ticket.status"
                :disabled="statusUpdating"
                @change="handleStatusChange"
              >
                <option value="open">{{ t("tickets.status.open") }}</option>
                <option value="in_progress">{{ t("tickets.status.in_progress") }}</option>
                <option value="closed">{{ t("tickets.status.closed") }}</option>
              </select>
            </div>
          </div>

          <div class="overview-grid">
            <div class="meta-card">
              <span class="meta-label">{{ t("tickets.detail.currentStatus") }}</span>
              <strong>{{ translateTicketStatus(ticket.status) }}</strong>
            </div>
            <div class="meta-card">
              <span class="meta-label">{{ t("tickets.detail.category") }}</span>
              <strong>{{ translateTicketCategory(ticket.category) }}</strong>
            </div>
            <div class="meta-card">
              <span class="meta-label">{{ t("tickets.detail.createdAt") }}</span>
              <strong>{{ formatDate(ticket.created_at, locale) }}</strong>
            </div>
            <div class="meta-card">
              <span class="meta-label">{{ t("tickets.detail.requester") }}</span>
              <strong>{{ ticket.user?.name || t("common.notProvided") }}</strong>
            </div>
          </div>

          <div class="description-box">
            <span class="meta-label">{{ t("tickets.detail.description") }}</span>
            <p>{{ ticket.description }}</p>
          </div>
        </article>

        <aside class="detail-card conversation-card">
          <div class="card-head conversation-head">
            <div>
              <p class="eyebrow">{{ t("tickets.detail.conversationEyebrow") }}</p>
              <h2>{{ t("tickets.detail.messagesTitle") }}</h2>
            </div>
            <span class="message-count">{{ t("tickets.detail.messagesCount", { count: messages.length }) }}</span>
          </div>

          <div v-if="loadingMessages && messages.length === 0" class="messages-state">
            <p>{{ t("tickets.detail.messagesLoading") }}</p>
          </div>

          <div v-else-if="messages.length === 0" class="messages-state">
            <p>{{ t("tickets.detail.messagesEmpty") }}</p>
          </div>

          <div v-else class="messages-list">
            <article
              v-for="message in messages"
              :key="message.id"
              class="message-bubble"
              :class="{ 'message-self': message.user?.id === auth.user?.id }"
            >
              <div class="message-meta">
                <strong>{{ message.user?.name || t("common.user") }}</strong>
                <span>{{ formatDate(message.created_at, locale) }}</span>
              </div>
              <p>{{ message.body }}</p>
            </article>
          </div>

          <form class="composer" @submit.prevent="handleSendMessage">
            <label class="composer-label" for="message-body">{{ t("tickets.detail.newMessage") }}</label>
            <textarea
              id="message-body"
              v-model="messageBody"
              :placeholder="t('tickets.detail.newMessagePlaceholder')"
              :disabled="sendingMessage"
              required
            ></textarea>
            <button type="submit" :disabled="sendingMessage || !messageBody.trim()">
              {{ sendingMessage ? t("tickets.detail.sendingMessage") : t("tickets.detail.sendMessage") }}
            </button>
          </form>
        </aside>
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import { useAuthStore } from "@/stores/authStore"
import { ticketService } from "@/services/ticketService"
import { translateTicketCategory, translateTicketStatus } from "@/utils/constants"
import { formatDate } from "@/utils/formatDate"

const route = useRoute()
const { t, locale } = useI18n()
const auth = useAuthStore()

const ticket = ref(null)
const messages = ref([])
const messageBody = ref("")
const loadingTicket = ref(true)
const loadingMessages = ref(true)
const sendingMessage = ref(false)
const statusUpdating = ref(false)
const pageError = ref("")
const pollingInterval = ref(null)

onMounted(async () => {
  await Promise.all([loadTicket(), loadMessages()])
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  pollingInterval.value = setInterval(async () => {
    await refreshMessages()
  }, 3000)
}

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

async function loadTicket() {
  loadingTicket.value = true
  pageError.value = ""
  try {
    const response = await ticketService.getById(route.params.id)
    ticket.value = response.data
  } catch (error) {
    pageError.value = t("tickets.detail.loadError")
  } finally {
    loadingTicket.value = false
  }
}

async function loadMessages() {
  loadingMessages.value = true
  try {
    const response = await ticketService.getMessages(route.params.id)
    messages.value = response.data
  } catch (error) {
    messages.value = []
  } finally {
    loadingMessages.value = false
  }
}

async function refreshMessages() {
  try {
    const response = await ticketService.getMessages(route.params.id)
    messages.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function handleSendMessage() {
  if (!messageBody.value.trim()) return

  sendingMessage.value = true
  try {
    const response = await ticketService.createMessage(route.params.id, messageBody.value.trim())
    messages.value.push(response.data)
    messageBody.value = ""
  } finally {
    sendingMessage.value = false
  }
}

async function handleStatusChange(event) {
  const nextStatus = event.target.value
  statusUpdating.value = true
  try {
    const response = await ticketService.updateStatus(route.params.id, nextStatus)
    ticket.value = response.data
  } finally {
    statusUpdating.value = false
  }
}

function statusClass(status) {
  return {
    "status-open": status === "open",
    "status-progress": status === "in_progress",
    "status-closed": status === "closed"
  }
}
</script>

<style scoped>
.ticket-detail-page {
  min-height: 100vh;
  padding: clamp(1.2rem, 2vw, 2rem);
  background:
    radial-gradient(circle at top left, rgba(170, 231, 206, 0.45), transparent 28%),
    linear-gradient(180deg, #f4f8fb 0%, #edf3f7 100%);
  color: #17212b;
}

.ticket-detail-shell,
.state-card {
  width: min(100%, 76rem);
  margin-inline: auto;
}

.ticket-detail-shell {
  display: grid;
  gap: 1.25rem;
}

.detail-card,
.state-card {
  border: 1px solid rgba(190, 203, 214, 0.8);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 34px rgba(28, 44, 60, 0.08);
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #5f6f7d;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem 2rem;
  border-radius: 1.4rem;
  background: linear-gradient(135deg, #2c6428 0%, #6fbf6a 100%);
  color: #fff;
  box-shadow: 0 16px 34px rgba(28, 44, 60, 0.15);
}

.detail-header .eyebrow {
  color: rgba(255, 255, 255, 0.55);
}

.detail-header h1 {
  color: #fff;
}

.detail-header .subtitle {
  color: rgba(255, 255, 255, 0.65);
}

.back-link {
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #0bb986;
  text-decoration: none;
  font-weight: 700;
}

h1, h2 { margin: 0; }
h1 { font-size: clamp(1.7rem, 2vw, 2.3rem); }
h2 { font-size: 1.05rem; }

.subtitle {
  margin: 0.55rem 0 0;
  color: #607181;
}

.header-badges {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.status-pill, .category-pill, .message-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill::before {
  content: "";
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.status-open { color: #18794e; background: #e9f8f0; }
.status-progress { color: #a35c00; background: #fff3df; }
.status-closed { color: #596b78; background: #edf2f6; }
.category-pill { color: #a63e2d; background: #ffe8df; }

.detail-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 1.25rem;
}

.detail-card, .state-card { padding: 1.4rem; }

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.status-editor { display: grid; gap: 0.35rem; }
.status-editor label, .composer-label, .meta-label {
  color: #607181;
  font-size: 0.8rem;
  font-weight: 700;
}

.status-editor select, .composer textarea, .composer button { font: inherit; }
.status-editor select, .composer textarea {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #cfdae4;
  border-radius: 0.95rem;
  background: #fff;
  color: #17212b;
  padding: 0.78rem 0.95rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.meta-card, .description-box, .messages-state {
  border: 1px solid rgba(207, 218, 228, 0.95);
  border-radius: 1.1rem;
  background: rgba(249, 251, 253, 0.9);
}

.meta-card { display: grid; gap: 0.35rem; padding: 1rem; }
.description-box { padding: 1rem; }
.description-box p { margin: 0.5rem 0 0; line-height: 1.6; color: #425361; }
.conversation-head { margin-bottom: 1rem; }
.message-count { color: #1f7f5d; background: #edf7f2; }

.messages-state {
  display: grid;
  place-items: center;
  min-height: 8rem;
  color: #607181;
  margin-bottom: 1rem;
}

.messages-list {
  display: grid;
  gap: 0.75rem;
  max-height: 24rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  margin-bottom: 1rem;
}

.message-bubble {
  display: grid;
  gap: 0.45rem;
  max-width: 85%;
  padding: 0.9rem 1rem;
  border-radius: 1rem 1rem 1rem 0.3rem;
  background: #f4f7fa;
  color: #2c3b48;
}

.message-self {
  margin-left: auto;
  border-radius: 1rem 1rem 0.3rem 1rem;
  background: #e7f6ef;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  color: #607181;
  font-size: 0.8rem;
}

.message-bubble p { margin: 0; line-height: 1.55; }
.composer { display: grid; gap: 0.65rem; }
.composer textarea { min-height: 7rem; resize: vertical; }
.composer button {
  justify-self: end;
  border: 0;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #2d9b75, #1f7f5d);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(31, 127, 93, 0.18);
}

.composer button:disabled { opacity: 0.7; }
.error-card { color: #a13f34; background: rgba(255, 233, 231, 0.9); }

@media (max-width: 900px) { .detail-layout { grid-template-columns: 1fr; } }
@media (max-width: 640px) {
  .card-head, .message-meta { flex-direction: column; align-items: flex-start; }
  .overview-grid { grid-template-columns: 1fr; }
  .message-bubble { max-width: 100%; }
  .composer button { width: 100%; justify-self: stretch; }
}
</style>
