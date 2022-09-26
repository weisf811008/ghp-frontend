<template>
  <div class="currentUser">
    <el-dropdown>
      <el-button icon="UserFilled">
        {{ user?.name }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleLogout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logoutUser } = authStore

const handleLogout = async (e) => {
  e.preventDefault()
  try {
    await logoutUser()
    ElNotification({
      type: 'success',
      message: '登出成功',
    })
    router.push({ name: 'Login' })
  } catch (e) {
    console.error(e)
    ElNotification({
      message: '登出失敗',
      type: 'error',
    })
  }
}
</script>
<style lang="scss" scoped>
.currentUser {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  height: 100%;
  right: 20px;
}
</style>
