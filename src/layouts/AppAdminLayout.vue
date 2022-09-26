<template>
  <el-container class="layout-container">
    <AppMenu />
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
import AppMenu from '../components/layoutComponents/AppMenu.vue'
import AppCurrentUser from '../components/layoutComponents/AppCurrentUser.vue'
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
