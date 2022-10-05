<template>
  <div>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="檢核大項"
        prop="category"
        fixed
        align="center"
        width="180"
      />
      <el-table-column label="編號" prop="no" fixed align="center" width="90" />
      <el-table-column label="檢核細項" prop="item" />
      <el-table-column label="週期" prop="period" align="center" width="90" />
      <el-table-column label="區域" prop="area" align="center" width="90" />
      <el-table-column
        label="GHP條文"
        prop="regulations"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.regulations.join(',') }}
        </template>
      </el-table-column>
      <el-table-column
        label="訪視表"
        prop="visitingForms"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.visitingForms.join(',') }}
        </template>
      </el-table-column>
      <el-table-column
        label="需填資料"
        prop="needCheckValue"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.needCheckValue ? '需要' : '不需要' }}
        </template>
      </el-table-column>
      <el-table-column
        label="每日衛生管理日誌"
        prop="needDaily"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.needDaily ? '列入' : '不列入' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button
            type="primary"
            text
            size="large"
            icon="EditPen"
            @click.prevent="showUpdateDialog(scope.row.id)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            size="large"
            icon="Delete"
            @click.prevent="showDeleteConfirm(scope.row)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <AppPagination
      v-model:page="page"
      v-model:pageSize="pageSize"
      :data="filterData"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Function,
    required: true,
  },
  update: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update'])

//search
const search = ref('')
const filterData = computed(
  () =>
    (tableData.value = props.items.filter(
      (data) =>
        !search.value ||
        data.category.includes(search.value) ||
        data.no.includes(search.value) ||
        data.item.includes(search.value) ||
        (data.period && data.period.includes(search.value)) ||
        (data.area && data.area.includes(search.value)) ||
        data.regulations.some((r) => r.includes(search.value)) ||
        data.visitingForms.some((v) => v.includes(search.value))
    ))
)

//pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}

const showUpdateDialog = (id) => {
  emit('update', id)
}

const showDeleteConfirm = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.no}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await props.delete(row.id)
        ElNotification({
          type: 'success',
          message: '刪除成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '刪除失敗',
        })
      }
    })
    .catch(() => {
      ElNotification({
        type: 'info',
        message: '取消刪除',
      })
    })
}
</script>
<style lang="scss" scoped></style>
