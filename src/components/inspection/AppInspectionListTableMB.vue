<template>
  <div>
    <el-card
      class="mb-card"
      v-for="(row, index) in tableData"
      :key="`insp-sm-${row.id}`"
    >
      <el-descriptions :column="1">
        <el-descriptions-item label="#">
          {{ index + (page - 1) * pageSize + 1 }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢日期">
          {{ format(parseISO(row.date), 'yyyy/MM/dd') }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢表單">
          {{ row.title }}
        </el-descriptions-item>
        <el-descriptions-item label="填報時間">
          {{ format(parseISO(row.createdAt), 'yyyy/MM/dd HH:mm') }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢人員">
          {{ row.inspectedBy.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <el-button
            type="info"
            text
            bg
            size="large"
            class="mb-button"
            icon="Document"
            @click.prevent="showCheckDrawer(row.id)"
          >
            查看巡檢紀錄
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, parseISO } from 'date-fns'

const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
  },
  pageSize: {
    type: Number,
  },
})

const emit = defineEmits(['update'])

const showCheckDrawer = (id) => {
  emit('update', id)
}
</script>

<style lang="scss" scoped>
.mb-card {
  margin: 10px 0;
}
.mb-button {
  width: 100%;
}
</style>
