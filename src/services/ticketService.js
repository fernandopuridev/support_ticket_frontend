import api from "@/services/api"

export const ticketService = {
  getAll() {
    return api.get("/api/v1/tickets")
  },

  getById(id) {
    return api.get(`/api/v1/tickets/${id}`)
  },

  create(ticket) {
    return api.post("/api/v1/tickets", { ticket })
  },

  updateStatus(id, status) {
    return api.patch(`/api/v1/tickets/${id}`, { ticket: { status } })
  },

  getMessages(ticketId) {
    return api.get(`/api/v1/tickets/${ticketId}/messages`)
  },

  createMessage(ticketId, body) {
    return api.post(`/api/v1/tickets/${ticketId}/messages`, {
      message: { body }
    })
  }
}
