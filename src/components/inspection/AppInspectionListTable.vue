<template>
  <el-table
    class="hidden-sm-and-down"
    :data="tableData"
    v-loading="isLoading"
    table-layout="auto"
  >
    <el-table-column label="項次" fixed align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="巡檢日期" prop="date" align="center" width="100">
      <template #default="scope">
        {{ format(parseISO(scope.row.date), 'yyyy/MM/dd') }}
      </template>
    </el-table-column>
    <el-table-column label="巡檢表單名稱" prop="title" />
    <el-table-column
      label="填報時間"
      prop="createdAt"
      align="center"
      width="200"
    >
      <template #default="scope">
        {{ format(parseISO(scope.row.createdAt), 'yyyy/MM/dd HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column label="巡檢人員" align="center" width="100">
      <template #default="scope">
        {{ scope.row.inspectedBy.name }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="220">
      <template #default="scope">
        <el-button
          type="info"
          text
          size="large"
          icon="Document"
          @click.prevent="() => showCheckDrawer(scope.row.id)"
        >
          查看巡檢紀錄
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup>
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

<style lang="scss" scoped></style>
