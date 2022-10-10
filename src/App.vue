<template>
  <layout>
    <router-view />
  </layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { Chart } from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors'
import Layout from './layouts/AppLayout.vue'

Chart.register(autocolors)

const router = useRouter()
const loading = ElLoading.service({ fullscreen: true })

router.isReady().then(() => {
  loading.close()
})
</script>
