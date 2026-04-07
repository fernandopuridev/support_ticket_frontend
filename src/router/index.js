import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/authStore"
import LoginPage from "@/pages/auth/LoginPage.vue"
import RegisterPage from "@/pages/auth/RegisterPage.vue"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage.vue"
import TicketsPage from "@/pages/tickets/TicketsPage.vue"
import TicketDetailPage from "@/pages/tickets/TicketDetailPage.vue"
// import AdminTicketsPage from "@/pages/admin/AdminTicketsPage.vue"

const routes = [
  { path: "/login", component: LoginPage, meta: { public: true } },
  { path: "/register", component: RegisterPage, meta: { public: true } },
  { path: "/forgot-password", component: ForgotPasswordPage, meta: { public: true } },
  { path: "/tickets", component: TicketsPage, meta: { requiresAuth: true } },
  { path: "/tickets/:id", component: TicketDetailPage, meta: { requiresAuth: true } },
  // { path: "/admin/tickets", component: AdminTicketsPage, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: "/", redirect: "/tickets" }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return "/login"
  if (to.meta.requiresAdmin && !auth.isAdmin) return "/tickets"
})

export default router
