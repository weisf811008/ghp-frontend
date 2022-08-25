<template>
  <component :is='layout'>
    <router-view></router-view>
  </component>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from './AppAdminLayout.vue'

const route = useRoute()
const layout = ref()

watch(
  () => route.meta?.layout,
  (metaLayout) => {
    layout.value = markRaw(metaLayout || AdminLayout)
  },
  { immediate: true }
)
</script>
