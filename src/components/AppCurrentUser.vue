<template>
  <div class="header">
    <span class="menu">
      <el-button
        icon="Menu"
        size="large"
        class="hidden-md-and-up"
        @click.prevent="menuStore.toggleShowMenu"
      >
      </el-button>
    </span>
    <span class="currentUser">
      <el-dropdown>
        <el-button icon="UserFilled" size="large">
          {{ user?.name }}
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.prevent="handleLogout">
              登出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>
<script setup>
import { ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menu'
import AppMenu from '../components/AppMenu.vue'

const router = useRouter()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { logoutUser } = authStore

const menuStore = useMenuStore()

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
.header {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  height: 100%;
  right: 20px;
}

@media screen and (max-width: 991px) {
  .header {
    display: flex;
    justify-content: space-between;
  }
}
</style>
