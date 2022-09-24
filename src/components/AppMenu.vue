<template>
  <el-menu
    class="menu"
    :default-active="currentIndex"
    :collapse="isCollapse"
    :unique-opened="true"
    @select="setCurrentIndex"
    router
  >
    <el-menu-item index="/home">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首頁</template>
    </el-menu-item>
    <el-sub-menu index="1" v-if="isValid('學校管理員')">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>基本檔設定</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/settings/regulations">GHP條文管理</el-menu-item>
        <el-menu-item index="/settings/visitingForms"
          >訪視表條文管理
        </el-menu-item>
        <el-menu-item index="/settings/categories"> 檢核大項主檔 </el-menu-item>
        <el-menu-item index="/settings/items"> 檢核細項主檔 </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item index="/forms" v-if="isValid('學校管理員')">
      <el-icon><Document /></el-icon>
      <template #title>巡檢目錄</template>
    </el-menu-item>
    <el-menu-item
      index="/inspection"
      v-if="isValid('學校管理員') || isValid('巡檢人員')"
    >
      <el-icon><List /></el-icon>
      <template #title>巡檢紀錄</template>
    </el-menu-item>
    <el-sub-menu index="2" v-if="isValid('學校管理員')">
      <template #title>
        <el-icon><Histogram /></el-icon>
        <span>報表管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/reports/daily">日報表</el-menu-item>
        <el-menu-item index="/reports/prodtemp">成品溫度報表</el-menu-item>
        <el-menu-item index="/reports/tnh">
          庫房、食材、檢體保存溫濕度報表
        </el-menu-item>
        <el-menu-item index="/reports/tableware">餐具檢驗報表</el-menu-item>
        <el-menu-item index="/reports/ghp">GHP報表</el-menu-item>
        <el-menu-item index="/reports/visiting">訪視表報表</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
    <el-sub-menu
      index="3"
      v-if="isValid('系統管理員') || isValid('學校管理員')"
    >
      <template #title>
        <el-icon><User /></el-icon>
        <span>使用者權限</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/settings/schools" v-if="isValid('系統管理員')">
          學校管理
        </el-menu-item>
        <el-menu-item
          index="/settings/admin/users"
          v-if="isValid('系統管理員')"
        >
          帳號管理
        </el-menu-item>
        <el-menu-item index="/settings/users" v-if="isValid('學校管理員')">
          學校帳號管理
        </el-menu-item>
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
        @click="() => setIsCollapse(false)"
      />
    </div>
    <div class="arrow">
      <el-button
        class="arrowButton"
        v-show="!isCollapse"
        icon="DArrowLeft"
        @click="() => setIsCollapse(true)"
      />
    </div>
  </el-menu>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menu'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const menuStore = useMenuStore()
const { currentIndex, isCollapse } = storeToRefs(menuStore)
const { setCurrentIndex, setIsCollapse } = menuStore

const isValid = (role) => {
  return user.value?.roles ? user.value.roles[0].role === role : false
}
</script>

<style lang="scss" scoped>
.menu {
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

.menu:not(.el-menu--collapse) {
  min-width: 300px;
}
</style>
