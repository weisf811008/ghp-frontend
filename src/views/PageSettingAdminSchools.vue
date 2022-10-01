<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>學校管理</h2>
        <el-button
          size="large"
          @click="() => (handleShowCreateDialog = true)"
          icon="Plus"
        >
          新增學校
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
            @click="handleShowUpdateDialog(scope.row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            size="large"
            icon="Delete"
            @click="handleDeleteSchool(scope.row)"
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
    title="新增學校"
    :before-close="handleCloseCreateDialog"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      label-width="auto"
      size="large"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="學校代碼" prop="code">
        <el-input v-model="createData.code" placeholder="請輸入學校代碼" />
      </el-form-item>
      <el-form-item label="學校名稱" prop="name">
        <el-input v-model="createData.name" placeholder="請輸入學校名稱" />
      </el-form-item>
      <el-form-item label="縣(市)" prop="city">
        <el-input v-model="createData.city" placeholder="請輸入縣(市)" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="createData.address" placeholder="請輸入地址" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="createData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="createData.url" placeholder="請輸入URL" />
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
          @click="(e) => handleCreateSchool(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改學校"
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
      <el-form-item label="學校名稱" prop="name">
        <el-input v-model="updateData.name" placeholder="請輸入學校名稱" />
      </el-form-item>
      <el-form-item label="縣(市)" prop="city">
        <el-input v-model="updateData.city" placeholder="請輸入縣(市)" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="updateData.address" placeholder="請輸入地址" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="updateData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="updateData.url" placeholder="請輸入URL" />
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
          @click="(e) => handleUpdateSchool(e, updateFormRef)"
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
import { useAdminSchoolStore } from '../stores/adminSchool'

const schoolStore = useAdminSchoolStore()

const { schools, isLoading } = storeToRefs(schoolStore)
const { getSchools, createSchool, updateSchool, deleteSchool } = schoolStore

const search = ref('')
const size = ref('default')

const handleShowCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const createDialogRef = ref()
const updateDialogRef = ref()
const createFormRef = ref()
const updateFormRef = ref()
const createData = ref({
  code: '',
  name: '',
  city: '',
  address: '',
  phone: '',
  url: '',
})

const updateData = ref({
  id: null,
  code: '',
  name: '',
  city: '',
  address: '',
  phone: '',
  url: '',
})

const rules = reactive({
  code: [
    { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
    { max: 10, message: '最多10個字元' },
  ],
  name: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  city: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 20, message: '最多20個字元' },
  ],
  address: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  phone: [{ max: 50, message: '最多50個字元' }],
  url: [{ max: 255, message: '最多255個字元' }],
})

const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])

const filterData = () =>
  (tableData.value = schools.value.filter(
    (data) =>
      !search.value ||
      data.code.includes(search.value) ||
      data.name.includes(search.value) ||
      data.city.includes(search.value) ||
      data.address.includes(search.value) ||
      data.phone.includes(search.value) ||
      data.url.includes(search.value)
  ))
const getFilteredData = computed(() => filterData())

const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)

onMounted(() => {
  getSchools()
})

const handleShowUpdateDialog = (row) => {
  updateData.value.id = row.id
  updateData.value.code = row.code
  updateData.value.name = row.name
  updateData.value.city = row.city
  updateData.value.address = row.address
  updateData.value.phone = row.phone
  updateData.value.url = row.url
  showUpdateDialog.value = true
}

const handleCloseCreateDialog = () => {
  handleShowCreateDialog.value = false
  createFormRef.value.resetFields()
  createFormRef.value.clearValidate()
}

const handleCloseUpdateDialog = (e) => {
  showUpdateDialog.value = false
  updateFormRef.value.resetFields()
  updateFormRef.value.clearValidate()
}

const handleCreateSchool = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await createSchool(createData.value)
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

const handleUpdateSchool = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await updateSchool(updateData.value.id, {
          code: updateData.value.code,
          name: updateData.value.name,
          city: updateData.value.city,
          address: updateData.value.address,
          phone: updateData.value.phone,
          url: updateData.value.url,
        })
        handleCloseUpdateDialog()
        ElNotification({
          type: 'success',
          message: '修改成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '修改失敗',
        })
      }
    }
  })
}

const handleDeleteSchool = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.name}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteSchool(row.id)
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

const handlePageChange = (p) => {
  page.value = p
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  button:first-child {
    margin-right: 10px;
  }
}

.formSelect {
  width: 100%;
}
</style>
