<template>
  <div>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="學校" fixed align="center" width="200">
        <template #default="scope">
          {{ schoolsMap[scope.row.schoolId] }}
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
        label="使用者"
        prop="name"
        fixed
        align="center"
        width="200"
      />
      <el-table-column label="修改日期/時間" align="center" width="200">
        <template #default="scope">
          {{ format(parseISO(scope.row.timestamp), 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作記錄" prop="message" />
    </el-table>
    <AppPagination
      v-model:page="page"
      v-model:pageSize="pageSize"
      :data="filterData"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format, parseISO, isValid } from 'date-fns'

const props = defineProps({
  adminHistories: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  schoolsMap: {
    type: Object,
    default: () => ({}),
  },
})

//search
const search = ref('')

const filterData = computed(() =>
  props.adminHistories.filter(
    (data) =>
      !search.value ||
      props.schoolsMap[data.schoolId]?.includes(search.value) ||
      data.username?.includes(search.value) ||
      data.name?.includes(search.value) ||
      data.message?.includes(search.value) ||
      format(parseISO(data.timestamp), 'yyyy-MM-dd HH:mm:ss').includes(
        search.value
      )
  )
)

// pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}
</script>

<style lang="scss" scoped></style>
