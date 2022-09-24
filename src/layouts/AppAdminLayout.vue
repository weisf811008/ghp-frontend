<template>
  <el-container class="layout-container">
    <AppMenu />
    <el-container>
      <el-header>
        <div class="toolbar">
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
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppMenu from '../components/AppMenu.vue'

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
body {
  margin: 0;
  .layout-container {
    height: 99vh;

    .el-header {
      position: sticky;
      top: 0;
      background-color: white;
      z-index: 10;
      text-align: right;
      font-size: 12px;
      border-bottom: 1px solid #e5eaf3;

      .toolbar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: sticky;
        height: 100%;
        right: 20px;
      }
    }

    .el-main {
      padding: 0;
    }
  }
}
</style>
