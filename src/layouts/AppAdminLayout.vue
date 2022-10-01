<template>
  <el-container class="layout-container">
    <AppMenu class="hidden-sm-and-down" />
    <AppMenu class="hidden-md-and-up" v-if="showMenu" />
    <el-container>
      <el-header>
        <AppCurrentUser />
      </el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMenuStore } from '../stores/menu'
import AppMenu from '../components/AppMenu.vue'
import AppCurrentUser from '../components/AppCurrentUser.vue'

const menuStore = useMenuStore()
const { showMenu } = storeToRefs(menuStore)
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
    }

    .el-main {
      padding: 0;
    }
  }
}
</style>
