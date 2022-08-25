<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢目錄</h2>
        <el-button @click="() => (showCreateForm = true)" icon="Plus">
          新增巡檢表單
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
      <el-table-column label="巡檢表單名稱" prop="title" />
      <el-table-column label="備註" prop="remarks" />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            text
            icon="EditPen"
            @click="handleShowUpdateForm(scope.row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            icon="Delete"
            @click="handleDeleteForm(scope.row)"
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
  <el-drawer
    ref="createDrawerRef"
    v-model="showCreateForm"
    title="巡檢表單建置"
    :direction="direction"
    size="80%"
    :before-close="handleCloseCreateDrawer"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="巡檢表單名稱" prop="title">
        <el-input v-model="createData.title" placeholder="請輸入巡檢目錄名稱" />
      </el-form-item>
      <div style="text-align: center">
        <el-transfer
          ref="createDataTransferRef"
          v-model="createData.itemIds"
          style="text-align: left; display: inline-block"
          filterable
          :render-content="handleRenderContent"
          :titles="['檢核細項總清單', '檢核表單項目']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :data="getTransferList()"
        >
        </el-transfer>
      </div>
    </el-form>
    <template #footer>
      <el-form-item label="備註">
        <el-input v-model="createData.remarks" />
      </el-form-item>
      <div style="flex: auto">
        <el-button @click="handleCloseCreateDrawer">取消</el-button>
        <el-button
          type="primary"
          @click="(e) => handleCreateForm(e, createFormRef)"
          >送出
        </el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer
    ref="updateDrawerRef"
    v-model="showUpdateForm"
    title="巡檢表單修改"
    :direction="direction"
    size="80%"
    :before-close="handleCloseUpdateDrawer"
  >
    <el-form
      ref="updateFormRef"
      :model="updateData"
      :rules="rules"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="巡檢目錄名稱" prop="title">
        <el-input v-model="updateData.title" placeholder="請輸入巡檢目錄名稱" />
      </el-form-item>
      <div style="text-align: center">
        <el-transfer
          ref="updateDataTransferRef"
          v-model="updateData.itemIds"
          style="text-align: left; display: inline-block"
          filterable
          :render-content="handleRenderContent"
          :titles="['檢核細項總清單', '檢核表單項目']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :data="getTransferList()"
        >
        </el-transfer>
      </div>
    </el-form>
    <template #footer>
      <el-form-item label="備註">
        <el-input v-model="updateData.remarks" />
      </el-form-item>
      <div style="flex: auto">
        <el-button @click="handleCloseUpdateDrawer">取消</el-button>
        <el-button
          type="primary"
          @click="(e) => handleUpdateForm(e, updateFormRef)"
          >送出
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useFormStore } from '../stores/form'
import { useItemStore } from '../stores/items'

const formStore = useFormStore()
const { forms } = storeToRefs(formStore)
const { getForms, getFormById, createForm, updateForm, deleteForm } = formStore

const itemStore = useItemStore()
// const { items } = storeToRefs(itemStore)
const { getItems, getTransferList } = itemStore

const search = ref('')
const drawer = ref(false)
const direction = ref('rtl')

const showCreateForm = ref(false)
const showUpdateForm = ref(false)
const createDrawerRef = ref()
const UpdateDrawerRef = ref()
const createFormRef = ref()
const updateFormRef = ref()
const createDataTransferRef = ref()
const updateDataTransferRef = ref()
const createData = ref({
  title: '',
  remarks: '',
  itemIds: [],
})

const updateData = ref({
  id: null,
  title: '',
  remarks: '',
  itemIds: [],
})

const rules = reactive({
  title: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  itemIds: [
    { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
  ],
})

const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])

const filterData = () =>
  (tableData.value = forms.value.filter(
    (data) =>
      !search.value ||
      data.title.includes(search.value) ||
      data.remarks.includes(search.value) ||
      data.itemIds.map((i) => i.itemIds.includes(search.value))
  ))
const getFilteredData = computed(() => filterData())

const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)

onMounted(() => {
  getForms()
  getItems()
})

const handleShowUpdateForm = async (row) => {
  const form = await getFormById(row.id)
  updateData.value.id = form.id
  updateData.value.title = form.title
  updateData.value.remarks = form.remarks
  updateData.value.itemIds = form.details.map((i) => i.itemId)
  showUpdateForm.value = true
}

const handleCloseCreateDrawer = () => {
  showCreateForm.value = false
  createData.value.itemIds = []
  createFormRef.value.resetFields()
  createFormRef.value.clearValidate()
  createDataTransferRef.value.clearQuery('left')
  createDataTransferRef.value.clearQuery('right')
}

const handleCloseUpdateDrawer = () => {
  showUpdateForm.value = false
  updateFormRef.value.resetFields()
  updateFormRef.value.clearValidate()
  updateDataTransferRef.value.clearQuery('left')
  updateDataTransferRef.value.clearQuery('right')
}

const handleCreateForm = (e, formRef) => {
  e.preventDefault()
  if (createData.value.itemIds.length === 0) {
    ElNotification({
      title: 'Error',
      message: '新增失敗，請選取檢核細項',
      type: 'error',
    })
  } else {
    formRef.validate(async (valid, fields) => {
      if (valid) {
        try {
          const data = {
            title: createData.value.title,
            remarks: createData.value.remarks,
            itemIds: createData.value.itemIds,
          }
          await createForm(data)
          handleCloseCreateDrawer()
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
}

const handleUpdateForm = (e, formRef) => {
  e.preventDefault()
  if (updateData.value.itemIds.length === 0) {
    ElNotification({
      title: 'Error',
      message: '修改失敗，請選取檢核細項',
      type: 'error',
    })
  } else {
    formRef.validate(async (valid, fields) => {
      if (valid) {
        try {
          const data = {
            id: updateData.value.id,
            title: updateData.value.title,
            remarks: updateData.value.remarks,
            itemIds: updateData.value.itemIds,
          }
          await updateForm(updateData.value.id, data)
          handleCloseUpdateDrawer()
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
}

const handleDeleteForm = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.title}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteForm(row.id)
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

const handleRenderContent = (h, option) => {
  return h('span', null, option.label)
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

:deep(.el-transfer) {
  width: 75vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-transfer-panel) {
  width: 30vw;
}

:deep(.el-input__wrapper) {
  width: 25vw;
}

:deep(.el-transfer-panel__body) {
  height: 50vh;
  padding: 5px;
}

@media screen and (max-width: 1080px){
  :deep(.el-transfer-panel) {
    width: 25vw;
  }
  :deep(.el-input__wrapper) {
    width: 20vw;
  }
}
</style>
