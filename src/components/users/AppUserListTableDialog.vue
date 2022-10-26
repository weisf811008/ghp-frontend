<template>
  <div>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色名稱" prop="roles" align="center" width="100">
        <template #default="scope">
          {{ scope.row.roles.map((r) => r.role).join(', ') }}
        </template>
      </el-table-column>
      <el-table-column label="使用者" prop="name" align="center" width="100" />
      <el-table-column
        label="帳號"
        prop="username"
        align="center"
        width="100"
      />
      <el-table-column label="電話" prop="phone" align="center" width="150" />
      <el-table-column label="Email" prop="email" align="center" />
      <el-table-column label="操作" align="center" width="340">
        <template #default="scope">
          <el-button
            type="primary"
            text
            size="large"
            icon="EditPen"
            @click.prevent="() => showUpdateDialog(scope.row.id)"
          >
            編輯
          </el-button>
          <el-button
            type="primary"
            text
            size="large"
            icon="Key"
            @click.prevent="() => showChangeDialog(scope.row.id)"
          >
            重設密碼
          </el-button>
          <el-button
            type="danger"
            text
            size="large"
            icon="Delete"
            @click.prevent="() => showDeleteConfirm(scope.row)"
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
  users: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    defualt: false,
  },
  delete: {
    type: Function,
    required: true,
  },
  reset: {
    type: Function,
  },
  update: {
    type: Boolean,
    defualt: false,
  },
})

const emit = defineEmits(['update', 'reset'])

//search
const search = ref('')
const filterData = computed(
  () =>
    (tableData.value = props.users.filter(
      (data) =>
        !data.reserved &&
        (!search.value ||
          data.roles.some((r) => r.role.includes(search.value)) ||
          data.name.includes(search.value) ||
          data.username.includes(search.value) ||
          data.phone?.includes(search.value) ||
          data.email?.includes(search.value))
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

const showChangeDialog = (id) => {
  emit('reset', id)
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
