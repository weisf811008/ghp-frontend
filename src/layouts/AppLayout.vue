<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup>
import { computed, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useMenuStore } from '../stores/menu'

const route = useRoute()
const menuStore = useMenuStore()
const { isMobile } = storeToRefs(menuStore)

const defaultLayout = 'Admin'

const layout = computed(() => {
  const layout = route.meta?.layout || defaultLayout
  return defineAsyncComponent(() => import(`./App${layout}Layout.vue`))
})

watch(
  () => route.name,
  () => {
    if (isMobile.value) {
      menuStore.toggleShowMenu(false)
    }
  },
  {
    immediate: true,
  }
)

const setWidth = () => {
  menuStore.setOffsetWidth(document.body.offsetWidth)
}

window.onresize = setWidth

setWidth()
</script>
