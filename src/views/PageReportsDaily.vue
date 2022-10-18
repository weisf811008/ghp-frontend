<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>每日衛生管理日誌</h2>
        <div>
          <AppSelectDate
            v-model:dateRange="dates"
            :handleChange="handleChange"
          />
          <AppDailyDownloadButton
            :dates="dates"
            :reports="reports"
            :abnormalRows="abnormalRows"
            :statusMap="statusMap"
          />
        </div>
      </div>
    </template>
    <AppDailyListTable
      :tableData="tableData"
      :isLoading="isLoading"
      :page="page"
      :pageSize="pageSize"
      :dates="dates"
      :getStatus="getStatus"
      :getStatusLabel="getStatusLabel"
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
import { addDays, subDays, startOfDay, format } from 'date-fns'

import { useReportDailyStore } from '../stores/reportsDaily'

const reportDailyStore = useReportDailyStore()
const { isLoading } = storeToRefs(reportDailyStore)
const { getReportDaily } = reportDailyStore

onMounted(() => {
  getReports()
})

const reports = ref([])
const abnormalRows = ref([])

const today = startOfDay(new Date())
const dates = ref([subDays(today, 5), today])

const getReports = async () => {
  const res = await getReportDaily(
    dates.value[0].toISOString(),
    dates.value[1].toISOString()
  )
  reports.value = res.rows.sort((a, b) => (a.no > b.no ? 1 : -1))
  abnormalRows.value = res.abnormalRows.sort((a, b) => (a.no > b.no ? 1 : -1))
}

const statusMap = {
  pass: '✓',
  fail: '不合格',
  others: '其他',
}

const getStatus = (data, diff) =>
  data ? data[format(addDays(dates.value[0], diff), 'yyyy-MM-dd')] : null

const getStatusLabel = (data, diff) => {
  const status = getStatus(data, diff)
  return status ? statusMap[status] : null
}

const handleChange = () => {
  getReports()
}

//pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}
</script>

<style lang="scss" scoped></style>
