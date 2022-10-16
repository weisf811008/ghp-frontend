<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>庫房、食材、檢體保存溫濕度報表</h2>
        <div>
          <AppSelectDate
            v-model:dateRange="dates"
            :handleChange="handleChange"
          />
          <AppTnhDownloadButton
            :dates="dates"
            :reports="reports"
            :abnormalRows="abnormalRows"
            :dayOfTheWeek="dayOfTheWeek"
          />
        </div>
      </div>
    </template>
    <AppTnhListTable
      :tableData="tableData"
      :isLoading="isLoading"
      :page="page"
      :pageSize="pageSize"
      :dayOfTheWeek="dayOfTheWeek"
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
import { useReportTnhStore } from '../stores/reportsTnh'

const reportTnhStore = useReportTnhStore()
const { isLoading } = storeToRefs(reportTnhStore)
const { getReportTnh } = reportTnhStore

onMounted(() => {
  getReports()
})

const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])
const dayOfTheWeek = ['日', '一', '二', '三', '四', '五', '六']

const reports = ref([])
const abnormalRows = ref([])

const getReports = async () => {
  const res = await getReportTnh(
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
</script>

<style lang="scss" scoped></style>
