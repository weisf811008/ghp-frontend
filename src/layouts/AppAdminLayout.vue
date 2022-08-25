<template>
  <el-container class="layout-container-demo">
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      router
    >
      <el-menu-item index="/home">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首頁</template>
      </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>基本檔設定</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/settings/regulations">條文管理</el-menu-item>
          <el-menu-item index="/settings/categories">
            檢核大項主檔
          </el-menu-item>
          <el-menu-item index="/settings/items"> 檢核細項主檔 </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-menu-item index="/forms">
        <el-icon><Document /></el-icon>
        <span>巡檢目錄</span>
      </el-menu-item>
      <el-menu-item index="/inspection">
        <el-icon><List /></el-icon>
        <span>巡檢紀錄</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Histogram /></el-icon>
          <span>報表管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/reports/ghp">GHP報表</el-menu-item>
          <el-menu-item index="/reports/daily">日報表</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><User /></el-icon>
          <span>使用者權限</span>
        </template>
        <el-menu-item-group>
          <!-- <el-menu-item index="/settings/schools">學校管理</el-menu-item> -->
          <el-menu-item index="/settings/users">帳號管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- <el-menu-item index="/history">
        <el-icon><DocumentCopy /></el-icon>
        <span>操作記錄</span>
      </el-menu-item> -->
      <div class="arrow">
        <el-button
          class="arrowButton"
          v-show="isCollapse"
          icon="DArrowRight"
          @click="isCollapse = !true"
        />
      </div>
      <div class="arrow">
        <el-button
          class="arrowButton"
          v-show="!isCollapse"
          icon="DArrowLeft"
          @click="isCollapse = !false"
        />
      </div>
    </el-menu>
    <el-container>
      <el-header>
        <div class="toolbar">
          <el-dropdown>
            <el-button icon="UserFilled">
              {{ user.name }}
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
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { loginUser, logoutUser, getUserInfo } = authStore

const router = useRouter()
const isCollapse = ref(false)

const handleLogout = async (e) => {
  e.preventDefault()
  try {
    await logoutUser()
    ElMessage({
      type: 'success',
      message: '登出成功',
    })
    router.push({ name: 'Login' })
  } catch (e) {
    console.error(e)
    ElNotification({
      title: 'Error',
      message: '登出失敗',
      type: 'error',
    })
  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
  .layout-container-demo {
    height: 98vh;
    .el-menu-vertical-demo {
      border-right: 1px solid #e5eaf3;

      .arrow {
        position: absolute;
        right: 0;
        bottom: 0;

        .arrowButton {
          border: none;
          width: 63px;
          height: 56px;
          padding: 0px 20px;
        }
      }
    }
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

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
