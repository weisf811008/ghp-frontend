<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>日報表</h2>
        <div class="block">
          <span class="demonstration">請選擇日期區間</span>
          <el-date-picker
            v-model="dates"
            type="daterange"
            :disabled-date="disabledDate"
            unlink-panels
            range-separator="To"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
            :shortcuts="shortcuts"
            @change="getReport"
          />
          <el-button type="primary" @click="handleDownload">
            下載Excel
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="items" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="檢核大項"
        fixed
        align="center"
        prop="category"
        width="180"
      />
      <el-table-column label="編號" prop="no" width="90" />
      <el-table-column label="檢核細項" prop="item" />
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
              pass: getStatus(report[scope.row.id], i) === 'pass',
              fail: getStatus(report[scope.row.id], i) === 'fail',
              others: getStatus(report[scope.row.id], i) === 'others',
            }"
          >
            {{ getStatusLabel(report[scope.row.id], i) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="getFilteredData.length"
      @current-change="handlePageChange"
    /> -->
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
import { useDailyStore } from '../stores/daily'

const daolyStore = useDailyStore()
const { getReportDaily } = daolyStore

const itemStore = useItemStore()
const { items } = storeToRefs(itemStore)
const { getItems } = itemStore

// const form = ref({
//   details: [],
// })
const report = ref({})

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 5), today])
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

const statusMap = {
  pass: '✓',
  fail: '不合格',
  others: '其他',
}

//page
const pageSize = ref(10)
const page = ref(1)
// const getFilteredData = computed(() => filterData())

// const getTableData = computed(() =>
//   filterData().slice(
//     (page.value - 1) * pageSize.value,
//     page.value * pageSize.value
//   )
// )

const f = 'yyyy-MM-dd'

const getPeriodInDays = computed(
  () => differenceInDays(new Date(dates.value[1]), new Date(dates.value[0])) + 1
)

const getStatus = (data, diff) =>
  data ? data[format(addDays(dates.value[0], diff), f)] : null

const getStatusLabel = (data, diff) =>
  getStatus(data, diff) ? statusMap[getStatus(data, diff)] : null

const getReport = async () => {
  report.value = await getReportDaily(
    format(dates.value[0], f),
    format(dates.value[1], f)
  )
}

onMounted(() => {
  getItems()
  getReport()
})

const handlePageChange = (p) => {
  page.value = p
}

const handleDownload = () => {
  const diff =
    differenceInDays(new Date(dates.value[1]), new Date(dates.value[0])) + 1
  const dateArr = Array(diff)
    .fill(new Date(dates.value[0]))
    .map((d, i) => addDays(d, i))

  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), 'yyyyMMdd'),
      '桃園市大竹國民小學',
      '',
      '',
      '',
      '文件編號',
      '',
      'DCES01',
    ],
    ['制定單位', '大竹國小', '每日衛生管理日誌', '', '', '', '版次', '', '1.0'],
    [''],
    [
      '區域',
      '檢查項目',
      '',
      ...dateArr.map((d) => format(d, 'MM/dd')),
      '學校覆核',
    ],
    ...items.value.map((it, i) => {
      return [
        it.category,
        it.item,
        '',
        ...dateArr.map((d) => {
          const dateStr = format(d, f)
          if (!report.value[it.id] || !report.value[it.id][dateStr]) {
            return ''
          }
          return statusMap[report.value[it.id][dateStr]]
        }),
      ]
    }),
  ])

  ws['!merges'] = [
    // info rows
    { s: { c: 2, r: 0 }, e: { c: 5, r: 0 } },
    { s: { c: 6, r: 0 }, e: { c: 7, r: 0 } },
    { s: { c: 8, r: 0 }, e: { c: 9, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 5, r: 1 } },
    { s: { c: 6, r: 1 }, e: { c: 7, r: 1 } },
    { s: { c: 8, r: 1 }, e: { c: 9, r: 1 } },
    // empty row
    { s: { c: 0, r: 2 }, e: { c: 9, r: 2 } },
    // header
    { s: { c: 1, r: 3 }, e: { c: 2, r: 3 } },
    // data
    ...items.value.map((v, i) => ({
      s: { c: 1, r: 4 + i },
      e: { c: 2, r: 4 + i },
    })),
  ]
  ws['!cols'] = [
    { wch: 10 },
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
  XLSX.utils.book_append_sheet(wb, ws, 'daily')

  XLSX.writeFile(wb, 'daily_report.xlsx')
}
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;
  overflow-x: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgb(96, 98, 102);

      .demonstration {
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
