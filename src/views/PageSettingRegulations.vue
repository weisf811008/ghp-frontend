<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>GHP條文管理</h2>
        <el-button
          size="large"
          @click="() => (handleShowCreateDialog = true)"
          icon="Plus"
        >
          新增GHP條文
        </el-button>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="getTableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="類別"
        prop="class"
        fixed
        align="center"
        width="170"
      />
      <el-table-column
        label="類別序號"
        prop="code"
        fixed
        align="center"
        width="100"
      />
      <el-table-column
        label="食品良好衛生規範法規GHP檢查"
        prop="description"
        fixed
      />

      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button
            type="primary"
            text
            size="large"
            icon="EditPen"
            @click="handleShowUpdateDialog(scope.row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            size="large"
            icon="Delete"
            @click="handleDeleteRegulation(scope.row)"
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
    v-model="handleShowCreateDialog"
    title="新增GHP條文"
    :before-close="handleCloseCreateDialog"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="類別" prop="class">
        <el-select
          class="formSelect"
          size="large"
          v-model="createData.class"
          placeholder="選擇類別"
        >
          <el-option label="食品業者一般性規定" value="食品業者一般性規定" />
          <el-option
            label="餐飲與即時熟食業者專業性規定"
            value="餐飲與即時熟食業者專業性規定"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="類別序號" prop="code">
        <el-input v-model="createData.code" placeholder="請輸入類別序號" />
      </el-form-item>
      <el-form-item label="食品良好衛生規範法規GHP檢查" prop="description">
        <el-input
          v-model="createData.description"
          rows="5"
          type="textarea"
          placeholder="請輸入食品良好衛生規範法規GHP檢查內容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="danger"
          text
          size="large"
          @click="handleCloseCreateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="(e) => handleCreateRegulation(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改GHP條文"
    :before-close="handleCloseUpdateDialog"
  >
    <el-form
      ref="updateFormRef"
      :model="updateData"
      :rules="rules"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="類別序號" prop="code">
        {{ updateData.code }}
      </el-form-item>
      <el-form-item label="類別" prop="class">
        <el-select
          class="formSelect"
          size="large"
          v-model="updateData.class"
          placeholder="選擇類別"
        >
          <el-option label="食品業者一般性規定" value="食品業者一般性規定" />
          <el-option
            label="餐飲與即時熟食業者專業性規定"
            value="餐飲與即時熟食業者專業性規定"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="食品良好衛生規範法規GHP檢查" prop="description">
        <el-input
          v-model="updateData.description"
          rows="5"
          type="textarea"
          placeholder="請輸入食品良好衛生規範法規GHP檢查內容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="danger"
          text
          size="large"
          @click="handleCloseUpdateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="(e) => handleUpdateRegulation(e, updateFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRegulationStore } from '../stores/regulations'

const regulationStore = useRegulationStore()
const { regulations, isLoading } = storeToRefs(regulationStore)
const {
  getRegulations,
  createRegulation,
  getRegulation,
  updateRegulation,
  deleteRegulation,
} = regulationStore

onMounted(() => {
  getRegulations()
})

const search = ref('')
const handleShowCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const createDialogRef = ref()
const updateFormRef = ref()
const createFormRef = ref()
const updateDialogRef = ref()
const createData = ref({
  class: '食品業者一般性規定',
  code: '',
  description: '',
})

const updateData = ref({
  id: null,
  class: '',
  code: '',
  description: '',
})

const rules = reactive({
  class: [{ required: true, message: '此欄位不得為空', trigger: ['change'] }],
  code: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 5, message: '最多5個字元' },
  ],
  description: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 4000, message: '最多4000個字元' },
  ],
})

const handleShowUpdateDialog = async (row) => {
  const item = await getRegulation(row.id)
  updateData.value.id = item.id
  updateData.value.class = item.class
  updateData.value.code = item.code
  updateData.value.description = item.description
  showUpdateDialog.value = true
}

const handleCloseCreateDialog = () => {
  handleShowCreateDialog.value = false
  createFormRef.value.resetFields()
  createFormRef.value.clearValidate()
}

const handleCloseUpdateDialog = () => {
  showUpdateDialog.value = false
  updateFormRef.value.resetFields()
  updateFormRef.value.clearValidate()
}

const handleCreateRegulation = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, firlds) => {
    if (valid) {
      try {
        await createRegulation(createData.value)
        handleCloseCreateDialog()
        ElNotification({
          type: 'success',
          message: '新增成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '新增失敗',
        })
      }
    }
  })
}

const handleUpdateRegulation = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, firlds) => {
    if (valid) {
      try {
        await updateRegulation(updateData.value.id, {
          class: updateData.value.class,
          code: updateData.value.code,
          description: updateData.value.description,
        })
        handleCloseUpdateDialog()
        ElNotification({
          type: 'success',
          message: '修改成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          message: '修改失敗',
          type: 'error',
        })
      }
    }
  })
}

const handleDeleteRegulation = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.code}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteRegulation(row.id)
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

//pagination
const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])

const filterData = () =>
  (tableData.value = regulations.value.filter(
    (data) =>
      !search.value ||
      data.class.includes(search.value) ||
      data.code.includes(search.value) ||
      data.description.includes(search.value)
  ))
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
</script>

<style lang="scss" scoped>
.formSelect {
  width: 100vw;
}

.dialog-footer {
  button:first-child {
    margin-right: 10px;
  }
}
</style>
