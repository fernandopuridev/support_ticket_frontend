import i18n from "@/plugins/i18n"

export const TICKET_FILTER_OPTIONS = [
  { labelKey: "tickets.filters.all", value: "all" },
  { labelKey: "tickets.filters.open", value: "open" },
  { labelKey: "tickets.filters.in_progress", value: "in_progress" },
  { labelKey: "tickets.filters.closed", value: "closed" }
]

export const TICKET_CATEGORY_OPTIONS = [
  { value: "reservation", labelKey: "tickets.categories.reservation" },
  { value: "payment", labelKey: "tickets.categories.payment" },
  { value: "cancellation", labelKey: "tickets.categories.cancellation" },
  { value: "information", labelKey: "tickets.categories.information" },
  { value: "technical", labelKey: "tickets.categories.technical" },
  { value: "other", labelKey: "tickets.categories.other" }
]

export function translateTicketStatus(status) {
  return i18n.global.t(`tickets.status.${status}`)
}

export function translateTicketCategory(category) {
  return i18n.global.t(`tickets.categories.${category}`)
}
