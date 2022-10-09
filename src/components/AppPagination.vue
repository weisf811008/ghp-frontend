<template>
  <div class="page-group">
    <el-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      layout="sizes, prev, pager, next"
      :total="data.length"
      @size-change="handlePageSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  pageChange: {
    type: Function,
  },
})

const emit = defineEmits(['pageChange', 'update:page', 'update:pageSize'])

const page = ref(props.page)
const pageSize = ref(props.pageSize)

const change = () => {
  const data = props.data.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
  emit('pageChange', data)
}

const handlePageSizeChange = () => {
  emit('update:pageSize', pageSize.value)
  change()
}

const handlePageChange = (p) => {
  page.value = p
  emit('update:page', page.value)
  change()
}

watch(() => props.data, change)
</script>

<style lang="scss" scoped></style>
