import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('@/views/Home.vue')
const Plans = () => import('@/views/Plans.vue');
const Target = () => import('@/views/Target.vue')
const ActivesPeriod = () => import('@/views/ActivesPeriod/ActivesPeriod.vue')
const IdentificationLocals = () => import('@/views/IdentificationLocals/IdentificationLocals.vue')
const AuthLogin = () => import('@/modules/auth/views/AuthLogin.vue')
const Budget = () => import('@/views/Budget/Budget.vue')
const Resume = () => import('@/views/Resume/Resume.vue')

Vue.use(VueRouter)

let routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: AuthLogin
  },
  {
    path: '/planos',
    name: 'Plans',
    meta: { requiresAuth: true },
    component: Plans
  },
  {
    path: '/identificacao-e-locais/:accountId',
    name: 'IdentificationLocals',
    meta: { requiresAuth: true },
    component: IdentificationLocals
  },
  {
    path: '/target',
    name: 'Target',
    meta: { requiresAuth: true },
    component: Target
  },
  {
    path: '/ativos-e-periodo',
    name: 'ActivesPeriod',
    meta: { requiresAuth: true },
    component: ActivesPeriod
  }, {
    path: '/Budget',
    name: 'Budget',
    meta: { requiresAuth: true },
    component: Budget
  },
  {
    path: '/resumo/:mediaPlanId',
    name: 'Resume',
    component: Resume
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  if (to.name !== 'Login' && to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'Login' })
  }
  next()
})

export default router
