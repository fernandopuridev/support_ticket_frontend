import { defineStore } from "pinia"
import { ref, computed } from "vue"
import api from "@/services/api"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null)
  const token = ref(localStorage.getItem("token") || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")

  async function login(email, password) {
    const response = await api.post("/auth/sign_in", {
      user: { email, password }
    })

    token.value = response.headers["authorization"]
    user.value = response.data.user
    
    localStorage.setItem("token", token.value)
    localStorage.setItem("user", JSON.stringify(user.value))
  }

  async function register(name, email, password) {
    const response = await api.post("/auth/sign_up", {
      user: { name, email, password }
    })
    return response
  }

  function logout() {
    api.delete("/auth/sign_out").finally(() => {
      token.value = null
      user.value = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    })
  }

  return { user, token, isAuthenticated, isAdmin, login, register, logout }
})
