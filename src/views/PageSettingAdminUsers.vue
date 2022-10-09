<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>帳號管理</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增帳號
        </el-button>
      </div>
    </template>
    <AppAdminUserListTableDialog
      :adminUsers="adminUsers"
      :isLoading="isLoading"
      :delete="deleteAdminUser"
      @update="showUpdateDialog"
      @reset="showChangeDialog"
    />
    <AppAdminUserCreateDialog
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createAdminUser"
      :schools="schools"
    />
    <AppAdminUserUpdateDialog
      v-model:show="isShowUpdateDialog"
      :data="adminUser"
      :schools="schools"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateAdminUser"
    />
    <AppUserChangeDialog
      v-model:show="isShowChangeDialog"
      :data="adminUser"
      :isLoading="isLoading"
      :reset="resetAdminPassword"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdminUserStore } from '../stores/adminUsers'
import { useAdminSchoolStore } from '../stores/adminSchool'
import AppAdminUserListTableDialog from '../components/adminUsers/AppAdminUserListTable.vue'
import AppAdminUserCreateDialog from '../components/adminUsers/AppAdminUserCreateDialog.vue'
import AppAdminUserUpdateDialog from '../components/adminUsers/AppAdminUserUpdateDialog.vue'

const adminUserStore = useAdminUserStore()
const { adminUsers, isLoading } = storeToRefs(adminUserStore)
const {
  getAdminUsers,
  getAdminUserById,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  resetAdminPassword,
} = adminUserStore

const schoolStore = useAdminSchoolStore()
const { schools } = storeToRefs(schoolStore)
const { getSchools } = schoolStore

const adminUser = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)
const isShowChangeDialog = ref(false)

const showCreateDialog = () => {
  isShowCreateDialog.value = true
}

const showUpdateDialog = async (id) => {
  adminUser.value = await getAdminUserById(id)
  isShowUpdateDialog.value = true
}

const showChangeDialog = async (id) => {
  adminUser.value = await getAdminUserById(id)
  isShowChangeDialog.value = true
}

const rules = reactive({
  // schoolId: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
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

onMounted(() => {
  getAdminUsers()
  getSchools()
})
</script>

<style lang="scss" scoped></style>
