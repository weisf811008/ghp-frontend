<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核大項主檔</h2>
        <el-button @click="() => (showCreateDialog = true)" icon="Plus">
          新增大項
        </el-button>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" />
    <el-table :data="getTableData" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="檢核大項" prop="category" />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            text
            icon="EditPen"
            @click="handleShowUpdateDialog(scope.row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            icon="Delete"
            @click="handleDeleteCategory(scope.row)"
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
  </el-card>
  <el-dialog
    ref="createDialogRef"
    v-model="showCreateDialog"
    title="新增大項"
    :before-close="handleCloseCreateDialog"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      size="large"
      status-icon
      hide-required-asterisk
    >
      <el-form-item prop="category">
        <el-input v-model="createData.category" placeholder="輸入大項" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseCreateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleCreateCategory(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改大項"
    :before-close="handleCloseUpdateDialog"
  >
    <el-form
      ref="updateFormRef"
      :model="updateData"
      :rules="rules"
      size="large"
      status-icon
      hide-required-asterisk
    >
      <el-form-item prop="category">
        <el-input v-model="updateData.category" placeholder="輸入大項" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseUpdateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleUpdateCategory(e, updateFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '../stores/categories'

const categoryStore = useCategoryStore()

const { categories } = storeToRefs(categoryStore)
const { getCategories, createCategory, updateCategory, deleteCategory } =
  categoryStore

const search = ref('')

const showCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const createDialogRef = ref(null)
const updateDialogRef = ref()
const createFormRef = ref()
const updateFormRef = ref()
const createData = ref({
  category: '',
})

const updateData = ref({
  id: null,
  category: '',
})

const rules = reactive({
  category: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '長度在255個字元內' },
  ],
})

const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])

const filterData = () =>
  (tableData.value = categories.value.filter(
    (data) => !search.value || data.category.includes(search.value)
  ))
const getFilteredData = computed(() => filterData())

const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)

onMounted(() => {
  getCategories()
})

const handleShowUpdateDialog = (row) => {
  updateData.value.id = row.id
  updateData.value.category = row.category
  showUpdateDialog.value = true
}

const handleCloseCreateDialog = () => {
  showCreateDialog.value = false
  createFormRef.value.resetFields()
  createFormRef.value.clearValidate()
}

const handleCloseUpdateDialog = (e) => {
  showUpdateDialog.value = false
  updateFormRef.value.resetFields()
  updateFormRef.value.clearValidate()
}

const handleCreateCategory = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await createCategory(createData.value)
        handleCloseCreateDialog()
        ElMessage({
          type: 'success',
          message: '新增成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          title: 'Error',
          message: '新增失敗',
          type: 'error',
        })
      }
    }
  })
}

const handleUpdateCategory = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await updateCategory(updateData.value.id, {
          category: updateData.value.category,
        })
        handleCloseUpdateDialog()
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          title: 'Error',
          message: '修改失敗',
          type: 'error',
        })
      }
    }
  })
}

const handleDeleteCategory = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.category}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteCategory(row.id)
        ElMessage({
          type: 'success',
          message: '刪除成功',
        })
      } catch (e) {
        console.error(e)
        ElMessage({
          type: 'error',
          message: '刪除失敗',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消刪除',
      })
    })
}

const handlePageChange = (p) => {
  page.value = p
}
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }

  .pages {
    justify-content: flex-end;
  }
  .dialog-footer {
    button:first-child {
      margin-right: 10px;
    }
  }
}
</style>
