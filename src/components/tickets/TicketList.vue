<template>
  <section class="tickets-list">
    <article v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
      <RouterLink class="ticket-link" :class="borderClass(ticket.status)" :to="`/tickets/${ticket.id}`">
        <div class="ticket-topline">
          <span class="status-pill" :class="statusClass(ticket.status)">
            {{ translateTicketStatus(ticket.status) }}
          </span>
          <span class="ticket-number">{{ t("tickets.list.number", { id: ticket.id }) }}</span>
        </div>

        <div class="ticket-main">
          <div>
            <h3>{{ ticket.title }}</h3>
            <p class="ticket-description">{{ ticket.description }}</p>
          </div>
          <span class="category-pill">{{ translateTicketCategory(ticket.category) }}</span>
        </div>

        <div class="ticket-footer">
          <span>{{ t("tickets.list.openedAt", { date: formatDate(ticket.created_at, locale) }) }}</span>
          <span v-if="ticket.user?.name">{{ t("tickets.list.openedBy", { name: ticket.user.name }) }}</span>
        </div>
      </RouterLink>
    </article>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { translateTicketCategory, translateTicketStatus } from "@/utils/constants"
import { formatDate } from "@/utils/formatDate"

defineProps({
  tickets: {
    type: Array,
    required: true
  }
})

const { t, locale } = useI18n()

function statusClass(status) {
  return {
    "status-open": status === "open",
    "status-progress": status === "in_progress",
    "status-closed": status === "closed"
  }
}

function borderClass(status) {
  return {
    "border-open": status === "open",
    "border-progress": status === "in_progress",
    "border-closed": status === "closed"
  }
}
</script>

<style scoped>
.tickets-list {
  display: grid;
  gap: 0.7rem;
}

.ticket-card {
  border: 1px solid rgba(183, 198, 210, 0.7);
  border-radius: 1.3rem;
  background: linear-gradient(180deg, #ffffff, #f8fbfd);
  box-shadow: 0 12px 28px rgba(27, 42, 56, 0.07);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.ticket-card:hover {
  box-shadow: 0 16px 36px rgba(27, 42, 56, 0.12);
}

.ticket-link {
  display: grid;
  gap: 0.65rem;
  padding: 1rem 1.2rem;
  color: inherit;
  text-decoration: none;
  border-left: 5px solid transparent;
}

.border-open    { border-left-color: #18794e; }
.border-progress { border-left-color: #a35c00; }
.border-closed  { border-left-color: #b9c8d4; }

.ticket-topline,
.ticket-footer,
.ticket-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
}

.ticket-topline {
  align-items: flex-start;
}

.ticket-number,
.ticket-footer {
  color: #607181;
  font-size: 0.82rem;
}

h3 {
  margin: 0 0 0.18rem;
  color: #17212b;
  font-size: 1.08rem;
}

.ticket-description {
  margin: 0;
  color: #556675;
  line-height: 1.5;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.status-pill,
.category-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 999px;
  padding: 0.32rem 0.62rem;
  font-size: 0.76rem;
  font-weight: 700;
}

.status-pill::before {
  content: "";
  width: 0.45rem;
  height: 0.45rem;
  margin-right: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.status-open     { color: #18794e; background: #e9f8f0; }
.status-progress { color: #a35c00; background: #fff3df; }
.status-closed   { color: #596b78; background: #edf2f6; }
.category-pill   { color: #a63e2d; background: #ffe8df; }

@media (max-width: 720px) {
  .ticket-main,
  .ticket-topline,
  .ticket-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-pill {
    align-self: flex-start;
  }
}
</style>
