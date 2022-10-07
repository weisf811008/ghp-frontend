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
        label="學校代碼"
        prop="code"
        fixed
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="學校名稱"
        prop="name"
        fixed
        align="center"
        width="200"
      />
      <el-table-column label="縣(市)" prop="city" align="center" width="100" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="電話" prop="phone" align="center" width="150" />
      <el-table-column label="URL" prop="url" align="center" width="300" />
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
  schools: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  delete: {
    type: Function,
  },
  update: {
    type: Function,
  },
})

const emit = defineEmits(['update'])

//search
const search = ref('')
const filterData = computed(
  () =>
    (tableData.value = props.schools.filter(
      (data) =>
        !search.value ||
        data.code.includes(search.value) ||
        data.name.includes(search.value) ||
        data.city.includes(search.value) ||
        data.address.includes(search.value) ||
        (data.phone && data.phone.includes(search.value)) ||
        (data.url && data.url.includes(search.value))
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
  ElMessageBox.confirm(`是否確定要刪除${row.name}`, '', {
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
