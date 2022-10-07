<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>學校帳號管理</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增帳號
        </el-button>
      </div>
    </template>
    <AppUserListTableDialog
      :users="users"
      :isLoading="isLoading"
      :delete="deleteUser"
      @update="showUpdateDialog"
      @reset="showChangeDialog"
    />
    <AppUserCreateDialog
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createUser"
    />
    <AppUserUpdateDialog
      v-model:show="isShowUpdateDialog"
      :data="user"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateUser"
    />
    <AppUserChangeDialog
      v-model:show="isShowChangeDialog"
      :data="user"
      :isLoading="isLoading"
      :reset="resetPassword"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/users'
import AppUserListTableDialog from '../components/users/AppUserListTableDialog.vue'
import AppUserCreateDialog from '../components/users/AppUserCreateDialog.vue'
import AppUserUpdateDialog from '../components/users/AppUserUpdateDialog.vue'
import AppUserChangeDialog from '../components/users/AppUserChangeDialog.vue'

const userStore = useUserStore()
const { users, isLoading } = storeToRefs(userStore)
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} = userStore

const user = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)
const isShowChangeDialog = ref(false)

const showCreateDialog = () => {
  isShowCreateDialog.value = true
}

const showUpdateDialog = async (id) => {
  user.value = await getUserById(id)
  isShowUpdateDialog.value = true
}

const showChangeDialog = async (id) => {
  user.value = await getUserById(id)
  isShowChangeDialog.value = true
}

const rules = reactive({
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
  password: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 100, message: '最多100個字元', trigger: 'blur' },
    { min: 6, message: '至少6個字元', trigger: 'blur' },
  ],
})

onMounted(() => {
  getUsers()
})
</script>
<style lang="scss" scoped></style>
