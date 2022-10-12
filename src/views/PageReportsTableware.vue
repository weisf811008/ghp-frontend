<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>餐具檢驗報表</h2>
        <div>
          <AppSelectDate
            v-model:dateRange="dates"
            :handleChange="handleChange"
          />
          <AppTablewareDownloadButton
            :dates="dates"
            :reports="reports"
            :abnormalRows="abnormalRows"
            :getDisplayText="getDisplayText"
          />
        </div>
      </div>
    </template>
    <AppTablewareListTable
      :tableData="tableData"
      :isLoading="isLoading"
      :page="page"
      :pageSize="pageSize"
      :getDisplayText="getDisplayText"
    />
    <AppPagination
      v-model:page="page"
      v-model:pageSize="pageSize"
      :data="reports"
      @pageChange="handlePageChange"
    />
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { subDays, startOfDay } from 'date-fns'
import { useReportTablewareStore } from '../stores/reportsTableware'

const reportTablewareStore = useReportTablewareStore()
const { isLoading } = storeToRefs(reportTablewareStore)
const { getReportTableware } = reportTablewareStore

const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

onMounted(() => {
  getReports()
})

const reports = ref([])
const abnormalRows = ref([])

const getReports = async () => {
  const res = await getReportTableware(
    dates.value[0].toISOString(),
    dates.value[1].toISOString()
  )
  reports.value = res.rows
  abnormalRows.value = res.abnormalRows
}

const handleChange = () => {
  getReports()
}

// pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}

const getDisplayText = (value) => {
  if (typeof value !== 'boolean') {
    return ''
  }
  return value ? '✓' : '不合格'
}
</script>

<style lang="scss" scoped></style>
