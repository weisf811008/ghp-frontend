import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const resource = 'menu'

export const useMenuStore = defineStore(resource, () => {
  const currentIndex = ref(null)
  const isCollapse = ref(false)
  const showMenu = ref(false)
  const offsetWidth = ref(0)

  const setCurrentIndex = (index) => {
    currentIndex.value = index
  }

  const setIsCollapse = (collapse) => {
    isCollapse.value = collapse
  }

  const setOffsetWidth = (width) => {
    offsetWidth.value = width
  }

  const toggleShowMenu = (show) => {
    if (typeof show !== 'boolean') {
      showMenu.value = !showMenu.value
      return
    }
    showMenu.value = show
  }

  const isMobile = computed(() => {
    return offsetWidth.value <= 975
  })

  return {
    currentIndex,
    isCollapse,
    showMenu,
    setCurrentIndex,
    setIsCollapse,
    setOffsetWidth,
    toggleShowMenu,
    isMobile,
  }
})
