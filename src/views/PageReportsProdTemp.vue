<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>成品中心溫度報表</h2>
        <div>
          <AppSelectDate
            v-model:dateRange="dates"
            :handleChange="handleChange"
          />
          <AppProdTempDownloadButton
            :dates="dates"
            :reports="reports"
            :abnormalRows="abnormalRows"
            :getDisplayText="getDisplayText"
          />
        </div>
      </div>
    </template>
    <AppProdTempListTable
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
import { useReportProdtempStore } from '../stores/reportsProdtemp'

const reportProdtempStore = useReportProdtempStore()
const { isLoading } = storeToRefs(reportProdtempStore)
const { getReportProdtemp } = reportProdtempStore

const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

onMounted(() => {
  getReports()
})

const reports = ref([])
const abnormalRows = ref([])

const getReports = async () => {
  const res = await getReportProdtemp(
    dates.value[0].toISOString(),
    dates.value[1].toISOString()
  )
  reports.value = res.rows
  abnormalRows.value = res.abnormalRows
}

const getDisplayText = (value) => {
  if (typeof value !== 'boolean') {
    return ''
  }
  return value ? '✓' : '不合格'
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
</script>

<style lang="scss" scoped></style>
