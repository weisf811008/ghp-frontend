<template>
  <div>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="getTableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="檢核大項" prop="category" />
      <el-table-column label="操作" align="center" width="220">
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
    <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="getFilteredData.length"
      @current-change="handlePageChange"
    />
    <!-- <AppPagination :filterData="filterData" @update="getTableData" /> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import AppPagination from '../AppPagination.vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  isLoading: Boolean,
  update: {
    type: Function,
    required: true,
  },
  delete: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['update'])

//search
const search = ref('')
const filterData = () =>
  props.categories.filter(
    (data) => !search.value || data.category.includes(search.value)
  )

// pagination
const page = ref(1)
const pageSize = ref(10)
const getFilteredData = computed(() => filterData())
const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)
const handlePageChange = (p) => {
  page.value = p
}

const showUpdateDialog = (id) => {
  emit('update', id)
}

const showDeleteConfirm = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.category}`, '', {
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
<style lang="scss" scoped>
.pages {
  justify-content: flex-end;
}
</style>
