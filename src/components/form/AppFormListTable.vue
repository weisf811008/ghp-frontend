<template>
  <div>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="巡檢表單名稱" prop="title" />
      <el-table-column label="備註" prop="remarks" width="200" />
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button
            type="primary"
            text
            size="large"
            icon="EditPen"
            @click.prevent="showUpdateDrawer(scope.row.id)"
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
  forms: {
    type: Array,
    required: true,
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
    (tableData.value = props.forms.filter(
      (data) =>
        !search.value ||
        data.title.includes(search.value) ||
        data.remarks?.includes(search.value)
    ))
)

//pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}

const showUpdateDrawer = (id) => {
  emit('update', id)
}

const showDeleteConfirm = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.title}`, '', {
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
