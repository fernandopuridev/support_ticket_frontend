import { defineStore } from "pinia"
import { ref, computed } from "vue"
import api from "@/services/api"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref(localStorage.getItem("token") || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")

  async function login(email, password) {
    const response = await api.post("/auth/sign_in", { user: { email, password } })
    token.value = response.headers["authorization"]
    user.value = response.data.user
    localStorage.setItem("token", token.value)
  }

  async function register(name, email, password) {
    return await api.post("/auth/sign_up", { user: { name, email, password } })
  }

  function logout() {
    api.delete("/auth/sign_out").finally(() => {
      token.value = null
      user.value = null
      localStorage.removeItem("token")
    })
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout }
})
