<template>
  <div class="layoutTemplate">
    <el-row>
      <el-col :xs="{ span: 24, offset: 0 }" :md="{ span: 8, offset: 8 }">
        <el-card shadow="never" class="layoutCard">
          <img src="../assets/logo.png" class="image" />
          <h2>大竹國小食安管理系統</h2>
          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="rules"
            size="large"
            status-icon
            hide-required-asterisk
          >
            <el-form-item label="帳號" prop="username">
              <el-input
                v-model="loginData.username"
                size="large"
                @keyup.enter="(e) => handleSubmit(e, loginFormRef)"
                placeholder="請輸入帳號"
              />
            </el-form-item>
            <el-form-item label="密碼" prop="password">
              <el-input
                v-model="loginData.password"
                type="password"
                size="large"
                autocomplete="off"
                @keyup.enter="(e) => handleSubmit(e, loginFormRef)"
                placeholder="請輸入密碼"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="login-button"
                size="large"
                @click="(e) => handleSubmit(e, loginFormRef)"
              >
                登入
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const { isLoading, user } = storeToRefs(authStore)
const { loginUser, logoutUser } = authStore

const router = useRouter()
const loginFormRef = ref()
const loginData = ref({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ required: true, message: '必填', trigger: 'blur' }],
  password: [{ required: true, message: '必填', trigger: 'blur' }],
})

const handleSubmit = async (e, formRef) => {
  e.preventDefault()
  if (!formRef) return
  await formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        await loginUser(loginData.value)
        router.push({ name: 'Home' })
      } catch (e) {
        ElNotification({
          type: 'error',
          message: '帳號或密碼錯誤',
        })
      }
    }
  })
}
</script>
<style lang="scss" scoped>
.layoutTemplate {
  transform: translateY(30%);

  .layoutCard {
    width: 360px;
    margin: auto;
    border: 0;

    h2 {
      text-align: center;
    }

    .login-button {
      width: 100%;
      max-width: 280px;
      margin-left: auto;
    }
  }
}
</style>
