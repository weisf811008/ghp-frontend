import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import LoginLayout from '../layouts/AppLoginLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/login',
      name: 'Login',
      component: () => import('../views/PageLogin.vue'),
      meta: { layout: LoginLayout },
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/PageHome.vue'),
    },
    {
      path: '/settings/regulations',
      name: 'SettingRegulations',
      component: () => import('../views/PageSettingRegulations.vue'),
    },
    {
      path: '/settings/categories',
      name: 'SettingCategories',
      component: () => import('../views/PageSettingCategories.vue'),
    },
    {
      path: '/settings/items',
      name: 'SettingItems',
      component: () => import('../views/PageSettingItems.vue'),
    },
    {
      path: '/forms',
      name: 'Forms',
      component: () => import('../views/PageForms.vue'),
    },
    {
      path: '/inspection',
      name: 'Inspection',
      component: () => import('../views/PageInspection.vue'),
    },
    {
      path: '/inspection/submitting',
      name: 'InspectionSubmitting',
      component: () => import('../views/PageInspectionSubmitting.vue'),
    },
    {
      path: '/inspection/correcting/:id',
      name: 'InspectionCorrecting',
      params: true,
      component: () => import('../views/PageInspectionCorrecting.vue'),
    },
    {
      path: '/reports/ghp',
      name: 'Reports./ghp',
      component: () => import('../views/PageReportsGhp.vue'),
    },
    {
      path: '/reports/daily',
      name: 'Reports./daily',
      component: () => import('../views/PageReportsDaily.vue'),
    },
    // {
    //   path: '/settings/schools',
    //   name: 'SettingSchools',
    //   component: () => import('../views/PageSettingSchools.vue')
    // },
    {
      path: '/settings/users',
      name: 'SettingUsers',
      component: () => import('../views/PageSettingUsers.vue'),
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/PageHistory.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: 'Home',
      },
    },
  ],
})

// redirect to login page if not logged in and trying to access a restricted page
const publicPages = ['Login']

router.beforeEach(async (to, from, next) => {
  const authRequired = !publicPages.includes(to.name)
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  try {
    await authStore.getUserInfo()
  } catch (e) {
    console.log(e)
  }
  if (authRequired && !user.value) {
    authStore.setReturnUrl(to.fullPath)
    return router.push({ name: 'Login' })
  }
  next()
})

export default router
