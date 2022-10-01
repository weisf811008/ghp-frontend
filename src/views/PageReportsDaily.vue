<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>每日衛生管理日誌</h2>
        <div class="block">
          <span class="selectDate">請選擇日期區間</span>
          <el-date-picker
            v-model="dates"
            type="daterange"
            size="large"
            :disabled-date="disabledDate"
            unlink-panels
            range-separator="To"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
            :shortcuts="shortcuts"
            @change="getReports"
          />
          <el-button type="primary" size="large" @click="handleDownload">
            下載Excel
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="getTableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="檢核大項"
        fixed
        align="center"
        prop="category"
        width="180"
      />
      <el-table-column label="編號" fixed prop="no" width="90" />
      <el-table-column label="檢核細項" fixed prop="item" min-width="400" />
      <el-table-column
        v-for="(j, i) in getPeriodInDays"
        :label="format(addDays(dates[0], i), 'MM/dd')"
        :key="`date-${i}`"
        prop="date"
        width="90"
        align="center"
      >
        <template #default="scope">
          <span
            :class="{
              pass: getStatus(reports[scope.row.id], i) === 'pass',
              fail: getStatus(reports[scope.row.id], i) === 'fail',
              others: getStatus(reports[scope.row.id], i) === 'others',
            }"
          >
            {{ getStatusLabel(reports[scope.row.id], i) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="reportItems.length"
      @current-change="handlePageChange"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  addDays,
  subDays,
  startOfDay,
  format,
  differenceInDays,
} from 'date-fns'
import * as XLSX from 'xlsx'
import { useItemStore } from '../stores/items'
import { useReportDailyStore } from '../stores/reportsDaily'

const reportDailyStore = useReportDailyStore()
const { isLoading } = storeToRefs(reportDailyStore)
const { getReportDaily } = reportDailyStore

const itemStore = useItemStore()
const { items } = storeToRefs(itemStore)
const { getItems } = itemStore

onMounted(() => {
  getItems()
  getReports()
})

const reports = ref({})

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 5), today])
const f = 'yyyy-MM-dd'
const formatDate = 'yyyyMMdd'
const shortcuts = [
  {
    text: '上週',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '前三個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const disabledDate = (time) => time.getTime() > Date.now()
const getPeriodInDays = computed(
  () => differenceInDays(new Date(dates.value[1]), new Date(dates.value[0])) + 1
)

const getReportItems = () => items.value.filter((item) => item.needDaily)
const reportItems = computed(getReportItems)

const getReports = async () => {
  reports.value = await getReportDaily(
    dates.value[0].toISOString(),
    dates.value[1].toISOString()
  )
}

const statusMap = {
  pass: '✓',
  fail: '不合格',
  others: '其他',
}

const getStatus = (data, diff) =>
  data ? data[format(addDays(dates.value[0], diff), f)] : null

const getStatusLabel = (data, diff) => {
  const status = getStatus(data, diff)
  return status ? statusMap[status] : null
}

//excel download
const handleDownload = () => {
  const sheetDate =
    format(dates.value[0], formatDate) +
    '~' +
    format(dates.value[1], formatDate)
  const diff =
    differenceInDays(new Date(dates.value[1]), new Date(dates.value[0])) + 1
  const dateArr = Array(diff)
    .fill(new Date(dates.value[0]))
    .map((d, i) => addDays(d, i))

  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), formatDate),
      '桃園市大竹國民小學',
      '',
      '',
      '',
      '',
      '文件編號',
      '',
      'DCES01',
    ],
    [
      '制定單位',
      '大竹國小',
      `每日衛生管理日誌(民國${format(dates.value[0], 'yyyy') - 1911}年）`,
      '',
      '',
      '',
      '',
      '版次',
      '',
      '1.0',
    ],
    [''],
    [
      '項次',
      '檢核大項',
      '檢核細項',
      '',
      ...dateArr.map((d) => format(d, 'MM/dd')),
      '備註',
    ],
    ...getReportItems().map((it, i) => {
      return [
        i + 1,
        it.category,
        it.item,
        '',
        ...dateArr.map((d) => {
          const dateStr = format(d, f)
          if (!reports.value[it.id] || !reports.value[it.id][dateStr]) {
            return ''
          }
          return statusMap[reports.value[it.id][dateStr]]
        }),
      ]
    }),
    ['衛生管理人員', '', '', '營養師', '', '', '', '單位主管', '', ''],
  ])

  ws['!merges'] = [
    // info rows
    { s: { c: 2, r: 0 }, e: { c: 6, r: 0 } },
    { s: { c: 7, r: 0 }, e: { c: 8, r: 0 } },
    { s: { c: 9, r: 0 }, e: { c: 10, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 6, r: 1 } },
    { s: { c: 7, r: 1 }, e: { c: 8, r: 1 } },
    { s: { c: 9, r: 1 }, e: { c: 10, r: 1 } },
    // empty row
    { s: { c: 0, r: 2 }, e: { c: 10, r: 2 } },
    // header rows
    { s: { c: 2, r: 3 }, e: { c: 3, r: 3 } },
    // data rows
    ...getReportItems().map((v, i) => ({
      s: { c: 2, r: 4 + i },
      e: { c: 3, r: 4 + i },
    })),
    //footer row
    {
      s: { c: 0, r: 4 + getReportItems().length },
      e: { c: 2, r: 4 + getReportItems().length },
    },
    {
      s: { c: 3, r: 4 + getReportItems().length },
      e: { c: 6, r: 4 + getReportItems().length },
    },
    {
      s: { c: 7, r: 4 + getReportItems().length },
      e: { c: 10, r: 4 + getReportItems().length },
    },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 16 },
    { wch: 10 },
    { wch: 36 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}每日衛生管理日誌`)

  XLSX.writeFile(wb, `${sheetDate}每日衛生管理日誌.xlsx`)
}

//pagination
const pageSize = ref(10)
const page = ref(1)

const handlePageChange = (p) => {
  page.value = p
}

const getTableData = computed(() =>
  getReportItems().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 350px;
  overflow-x: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgb(96, 98, 102);

      .selectDate {
        margin-right: 10px;
        font-size: 14px;
      }
    }

    h2 {
      margin: 0;
    }

    .el-button {
      margin-left: 20px;
    }
  }

  .pass {
    color: #67c23a;
  }

  .fail {
    color: #f56c6c;
  }

  .others {
    color: #e6a23c;
  }

  .formReport {
    margin-top: 20px;
    font-size: 14px;
    color: rgb(96, 98, 102);

    span {
      margin-right: 10px;
    }
  }

  .pages {
    justify-content: flex-end;
  }
}
</style>
