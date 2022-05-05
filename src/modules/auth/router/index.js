const AuthLogin = () => import('@/modules/auth/views/AuthLogin.vue')

const routes = [
    {
        path: '/login',
        name: 'Authlogin',
        component: AuthLogin
      }
]

export default routes;