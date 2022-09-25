import { ref } from 'vue'
import { defineStore } from 'pinia'

const resource = 'menu'

export const useMenuStore = defineStore(resource, () => {
  const currentIndex = ref(null)
  const isCollapse = ref(false)

  const setCurrentIndex = (index) => {
    currentIndex.value = index
  }

  const setIsCollapse = (collapse) => {
    isCollapse.value = collapse
  }

  return {
    currentIndex,
    isCollapse,
    setCurrentIndex,
    setIsCollapse,
  }
})
