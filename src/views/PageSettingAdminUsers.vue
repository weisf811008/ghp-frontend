<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>帳號管理</h2>
        <el-button @click="() => (showCreateDialog = true)" icon="Plus">
          新增帳號
        </el-button>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" />
    <el-table :data="getTableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="學校名稱" fixed align="center" width="200">
        <template #default="scope">
          {{ scope.row.school.name }}
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
      <el-table-column label="操作" align="center" width="320">
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
            type="primary"
            text
            icon="Key"
            @click="() => handleChangeDialog(scope.row)"
          >
            重設密碼
          </el-button>
          <el-button
            type="danger"
            text
            icon="Delete"
            @click="handleDeleteUser(scope.row)"
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
    title="新增帳號"
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
      <el-form-item label="學校名稱" prop="schoolId">
        <el-select
          class="formSelect"
          v-model="createData.schoolId"
          placeholder="選擇學校"
        >
          <el-option
            v-for="school in schools"
            :value="school.id"
            :label="`[${school.code}]${school.name}`"
            :key="`select-school-${school.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色名稱" prop="role">
        <el-select
          class="formSelect"
          v-model="createData.role"
          placeholder="選擇角色"
        >
          <el-option value="學校管理員" />
          <el-option value="巡檢人員" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用者" prop="name">
        <el-input v-model="createData.name" placeholder="請輸入使用者" />
      </el-form-item>
      <el-form-item label="帳號" prop="username">
        <el-input v-model="createData.username" placeholder="請輸入帳號" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input
          v-model="createData.password"
          type="password"
          autocomplete="off"
          placeholder="請輸入密碼"
        />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="createData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="createData.email" placeholder="請輸入Email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseCreateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleCreateUser(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改帳號"
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
      <el-form-item label="角色名稱" prop="role">
        <el-select
          class="formSelect"
          v-model="updateData.role"
          placeholder="選擇角色"
        >
          <el-option value="學校管理員" />
          <el-option value="巡檢人員" />
        </el-select>
      </el-form-item>
      <el-form-item label="使用者" prop="name">
        <el-input v-model="updateData.name" placeholder="請輸入使用者" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="updateData.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="updateData.email" placeholder="請輸入Email" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseUpdateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleUpdateUser(e, updateFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="ChangeDialogRef"
    v-model="showChangeDialog"
    title="重設密碼"
    :before-close="handleCloseChangeDialog"
  >
    <div style="margin-bottom: 20px">
      重設
      <span class="showUserData">
        {{ changeData.name }}({{ changeData.username }})
      </span>
      的密碼
    </div>
    <el-form
      ref="changeFormRef"
      :model="changeData"
      :rules="rules"
      label-width="auto"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="重設密碼" prop="password">
        <el-input
          v-model="changeData.password"
          type="password"
          autocomplete="off"
          placeholder="請輸入新密碼"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseChangeDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleChangePassword(e, changeFormRef)"
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
import { useAdminUserStore } from '../stores/adminUsers'
import { useAdminSchoolStore } from '../stores/adminSchool'

const adminUserStore = useAdminUserStore()
const { adminUsers, isLoading } = storeToRefs(adminUserStore)
const {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminPassword,
} = adminUserStore

const schoolStore = useAdminSchoolStore()
const { schools } = storeToRefs(schoolStore)
const { getSchools } = schoolStore

const showCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const showChangeDialog = ref(false)

const createDialogRef = ref()
const updateDialogRef = ref()
const ChangeDialogRef = ref()

const createFormRef = ref()
const updateFormRef = ref()
const changeFormRef = ref()

const createData = ref({
  schoolId: null,
  role: [],
  name: '',
  username: '',
  password: '',
  phone: '',
  email: '',
})

const updateData = ref({
  id: null,
  schoolId: null,
  role: [],
  name: '',
  username: '',
  phone: '',
  email: '',
})

const changeData = ref({
  id: null,
  name: '',
  username: '',
  password: '',
})

onMounted(() => {
  getAdminUsers()
  getSchools()
})

const search = ref('')
const filterData = () =>
  (tableData.value = adminUsers.value.filter(
    (data) =>
      !data.reserved &&
      (!search.value ||
        data.school.name.includes(search.value) ||
        data.roles.some((r) => r.role.includes(search.value)) ||
        data.name.includes(search.value) ||
        data.username.includes(search.value) ||
        data.phone.includes(search.value) ||
        data.email.includes(search.value))
  ))

const rules = reactive({
  schoolId: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
  role: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 50, message: '最多50個字元' },
  ],
  name: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  username: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 100, message: '最多100個字元' },
  ],
  password: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 100, message: '最多100個字元' },
  ],
  phone: [
    {
      validator(rule, value, callback) {
        if (!value || /^0\d{1,3}-?\d{3,4}-?\d{3,4}#?\d{0,6}$/.test(value)) {
          callback()
        } else {
          callback(new Error('電話號碼格式錯誤'))
        }
      },
      trigger: 'blur',
    },
  ],
})

//pagination
const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])
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

const handleShowUpdateDialog = async (row) => {
  const item = await getAdminUser(row.id)
  updateData.value.id = item.id
  updateData.value.schoolId = item.schoolId
  updateData.value.role = item.roles[0].role
  updateData.value.name = item.name
  updateData.value.username = item.username
  updateData.value.phone = item.phone
  updateData.value.email = item.email
  showUpdateDialog.value = true
}

const handleChangeDialog = (row) => {
  showChangeDialog.value = true
  changeData.value.id = row.id
  changeData.value.name = row.name
  changeData.value.username = row.username
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

const handleCloseChangeDialog = () => {
  showChangeDialog.value = false
  changeFormRef.value.resetFields()
  changeFormRef.value.clearValidate()
}

const handleCreateUser = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          schoolId: createData.value.schoolId,
          roles: [createData.value.role],
          name: createData.value.name,
          username: createData.value.username,
          password: createData.value.password,
          phone: createData.value.phone,
          email: createData.value.email,
        }
        await createAdminUser(data)
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

const handleUpdateUser = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          schoolId: updateData.value.schoolId,
          roles: [updateData.value.role],
          name: updateData.value.name,
          username: updateData.value.username,
          phone: updateData.value.phone,
          email: updateData.value.email,
        }
        await updateAdminUser(updateData.value.id, data)
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

const handleChangePassword = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await resetAdminPassword(changeData.value.id, changeData.value.password)
        handleCloseChangeDialog()
        ElNotification({
          type: 'success',
          message: '重設密碼成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          type: 'error',
          message: '重設密碼失敗',
        })
      }
    }
  })
}

const handleDeleteUser = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.name}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteAdminUser(row.id)
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

.formSelect {
  width: 100%;
}

.showUserData {
  font-weight: bold;
}
</style>
