import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { ElNotification } from 'element-plus'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/PageLogin.vue'),
      meta: { layout: 'Login' },
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
      path: '/settings/visitingForms',
      name: 'SettingVisits',
      component: () => import('../views/PageSettingVisitingForms.vue'),
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
      path: '/inspection/submitting/:formId',
      name: 'InspectionSubmitting',
      component: () => import('../views/PageInspectionSubmitting.vue'),
    },
    // {
    //   path: '/inspection/correcting/:id',
    //   name: 'InspectionCorrecting',
    //   params: true,
    //   component: () => import('../views/PageInspectionCorrecting.vue'),
    // },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/PageDashboard.vue'),
    },
    {
      path: '/reports/daily',
      name: 'ReportsDaily',
      component: () => import('../views/PageReportsDaily.vue'),
    },
    {
      path: '/reports/prodtemp',
      name: 'ReportsProdTemp',
      component: () => import('../views/PageReportsProdTemp.vue'),
    },
    {
      path: '/reports/tnh',
      name: 'ReportsTnh',
      component: () => import('../views/PageReportsTnh.vue'),
    },
    {
      path: '/reports/tableware',
      name: 'ReportsTableware',
      component: () => import('../views/PageReportsTableware.vue'),
    },
    {
      path: '/reports/ghp',
      name: 'ReportsGhp',
      component: () => import('../views/PageReportsGhp.vue'),
    },
    {
      path: '/reports/visiting',
      name: 'ReportsVisiting',
      component: () => import('../views/PageReportsVisiting.vue'),
    },
    {
      path: '/settings/admin/schools',
      name: 'SettingAdminSchools',
      component: () => import('../views/PageSettingAdminSchools.vue'),
    },
    {
      path: '/settings/admin/users',
      name: 'SettingAdminUsers',
      component: () => import('../views/PageSettingAdminUsers.vue'),
    },
    {
      path: '/settings/users',
      name: 'SettingUsers',
      component: () => import('../views/PageSettingUsers.vue'),
    },
    {
      path: '/admin/histories',
      name: 'AdminHistories',
      component: () => import('../views/PageAdminHistories.vue'),
    },
    {
      path: '/histories',
      name: 'Histories',
      component: () => import('../views/PageHistories.vue'),
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
    if (authRequired) {
      await authStore.getUserInfo()
    }
  } catch (e) {}

  if (authRequired && !(user.value && user.value.username)) {
    authStore.setReturnUrl(to.fullPath)
    next({ name: 'Login' })
    return
  }
  next()
})

export default router
