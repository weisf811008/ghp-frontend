<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>訪視表條文管理</h2>
        <el-button @click="() => (showCreateDialog = true)" icon="Plus">
          新增訪視表條文
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
      <el-table-column
        label="類別"
        prop="class"
        fixed
        align="center"
        width="170"
      />
      <el-table-column
        label="編號"
        prop="code"
        fixed
        align="center"
        width="100"
      />
      <el-table-column
        label="訪視項目"
        prop="description"
        fixed
      />
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
            @click="handleDeleteRegulation(scope.row)"
            width="80px"
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
    title="新增訪視表條文"
    :before-close="handleCloseCreateDialog"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      label-width="auto"
      :label-position="labelPosition"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="類別" prop="class">
        <el-select
          class="formSelect"
          v-model="createData.class"
          placeholder="選擇類別"
        >
          <el-option label="衛生訪視內容" value="衛生訪視內容" />
          
        </el-select>
      </el-form-item>
      <el-form-item label="編號" prop="code">
        <el-input v-model="createData.code" placeholder="請輸入編號" />
      </el-form-item>
      <el-form-item label="訪視項目" prop="description">
        <el-input
          v-model="createData.description"
          rows="5"
          type="textarea"
          placeholder="請輸入訪視項目"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseCreateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleCreateRegulation(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改訪視表條文"
    :before-close="handleCloseUpdateDialog"
  >
    <el-form
      ref="updateFormRef"
      :model="updateData"
      :rules="rules"
      label-width="auto"
      :label-position="labelPosition"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="類別" prop="class">
        <el-select
          class="formSelect"
          v-model="updateData.class"
          placeholder="選擇類別"
        >
          <el-option label="衛生訪視內容" value="衛生訪視內容" />
        </el-select>
      </el-form-item>
      <el-form-item label="編號" prop="code">
        <el-input v-model="updateData.code" placeholder="請輸入編號" />
      </el-form-item>
      <el-form-item label="訪視項目" prop="description">
        <el-input
          v-model="updateData.description"
          rows="5"
          type="textarea"
          placeholder="請輸入訪視項目"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseUpdateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleUpdateRegulation(e, updateFormRef)"
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
import { useRegulationStore } from '../stores/regulations'

const regulationStore = useRegulationStore()

const { regulations } = storeToRefs(regulationStore)
const { getRegulations, createRegulation, updateRegulation, deleteRegulation } =
  regulationStore

const search = ref('')
const labelPosition = ref('right')

const showCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const createDialogRef = ref()
const updateFormRef = ref()
const createFormRef = ref()
const updateDialogRef = ref()
const createData = ref({
  class: '',
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
  // class: [
  //   { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
  //   { max: 50, message: '最多50個字元' },
  // ],
  // code: [
  //   { required: true, message: '此欄位不得為空', trigger: 'blur' },
  //   { max: 5, message: '最多5個字元' },
  // ],
  // description: [
  //   { required: true, message: '此欄位不得為空', trigger: 'blur' },
  //   { max: 4000, message: '最多4000個字元' },
  // ],
})

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

onMounted(() => {
  getRegulations()
})

const handleShowUpdateDialog = (row) => {
  updateData.value.id = row.id
  updateData.value.class = row.class
  updateData.value.code = row.code
  updateData.value.description = row.description
  showUpdateDialog.value = true
}

const handleCloseCreateDialog = () => {
  showCreateDialog.value = false
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

const handleDeleteRegulation = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.code}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteRegulation(row.id)
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

  .formSelect {
    width: 100vw;
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
