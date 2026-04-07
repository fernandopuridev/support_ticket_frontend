import api from "./api"

export const ticketService = {
  getAll() { return api.get("/api/v1/tickets") },
  getById(id) { return api.get(`/api/v1/tickets/${id}`) },
  create(data) { return api.post("/api/v1/tickets", { ticket: data }) },
  updateStatus(id, status) { return api.patch(`/api/v1/tickets/${id}`, { ticket: { status } }) },
  getMessages(ticketId) { return api.get(`/api/v1/tickets/${ticketId}/messages`) },
  sendMessage(ticketId, body) { return api.post(`/api/v1/tickets/${ticketId}/messages`, { message: { body } }) }
}
