<template>
  <layout>
    <router-view />
  </layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import Layout from './layouts/AppLayout.vue'

const router = useRouter()
const loading = ElLoading.service({ fullscreen: true })

router.isReady().then(() => {
  loading.close()
})
</script>
