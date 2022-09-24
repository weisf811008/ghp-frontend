<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const defaultLayout = 'AppAdminLayout'

const layout = computed(() => {
  const layout = route.meta?.layout || defaultLayout
  return defineAsyncComponent(() => import(`./${layout}.vue`))
})
</script>
