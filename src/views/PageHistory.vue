<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>操作記錄</h2>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" />
    <el-table :data="filterTableData" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="帳號"
        prop="username"
        fixed
        align="center"
        width="200"
      />
      <el-table-column
        label="修改日期/時間"
        prop="time"
        align="center"
        width="300"
      />
      <el-table-column label="修改內容" prop="content" />
    </el-table>
    <!-- <el-pagination
      class="pages"
      layout="prev, pager, next"
      :total="regulations.length"
    /> -->
  </el-card>
</template>
<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const labelPosition = ref('right')

// onMounted(() => {
// })

// const filterTableData = computed(() =>
//   historys
//     ? historys.value.filter(
//         data =>
//           !search.value ||
//           data.username.includes(search.value) ||
//           data.time.includes(search.value) ||
//           data.content.includes(search.value)
//       )
//     : []
// )
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }

  .pages {
    justify-content: flex-end;
  }

  .dialog-footer {
    button:first-child {
      margin-right: 10px;
    }
  }
}

.formSelect {
  width: 100vw;
}
</style>
