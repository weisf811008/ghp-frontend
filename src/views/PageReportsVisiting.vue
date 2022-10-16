<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>訪視表報表</h2>
        <div>
          <AppSelectDate
            v-model:dateRange="dates"
            :handleChange="handleChange"
          />
          <AppVisitingDownloadButton
            :dates="dates"
            :reports="reports"
            :getStatusDetail="getStatusDetail"
          />
        </div>
      </div>
    </template>
    <AppVisitingListTable
      :tableData="tableData"
      :isLoading="isLoading"
      :page="page"
      :pageSize="pageSize"
      :getStatusDetail="getStatusDetail"
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
import { useReportVisitingStore } from '../stores/reportsVisiting'

const reportVisitingStore = useReportVisitingStore()
const { isLoading } = storeToRefs(reportVisitingStore)
const { getReportVisiting } = reportVisitingStore

const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

onMounted(() => {
  getReports()
})

const reports = ref([])

const getReports = async () => {
  const [start, end] = dates.value
  reports.value = await getReportVisiting(
    start.toISOString(),
    end.toISOString()
  )
  reports.value.sort((a, b) => (a.code > b.code ? 1 : -1))
}

const getStatusDetail = ({ date, itemNo, remarks }) =>
  `${date}(${itemNo}${remarks ? ` ${remarks}` : ''})`

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

<style lang="scss" scoped>
:deep(.el-descriptions__cell) {
  display: block;
}
</style>
