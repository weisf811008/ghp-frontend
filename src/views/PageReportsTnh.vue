<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>庫房、食材、檢體保存溫濕度報表</h2>
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
          <el-button
            type="primary"
            size="large"
            @click.prevent="handleDownload"
          >
            下載Excel
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="getTableData" v-loading="isLoading" style="width: 100%">
      <el-table-column label="項次" align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template #default="scope">
          {{ format(parseISO(scope.row.date), f) }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="星期" align="center">
        <template #default="scope">
          {{ dayOfTheWeek[getDay(parseISO(scope.row.date))] }}
        </template>
      </el-table-column>
      <el-table-column label="庫房溫濕度" align="center">
        <el-table-column label="溫度(°C)" align="center">
          <template #default="scope">
            <span :class="{ fail: scope.row.warehouseTemp >= 27 }">
              {{ scope.row.warehouseTemp }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="濕度(%)" align="center">
          <template #default="scope">
            <span :class="{ fail: scope.row.warehouseHum >= 65 }">
              {{ scope.row.warehouseHum }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="食材冰箱" align="center">
        <el-table-column label="冷藏溫度(°C)" align="center">
          <template #default="scope">
            <span
              :class="{
                fail: scope.row.fridgeCold > 7 || scope.row.fridgeCold < 0,
              }"
            >
              {{ scope.row.fridgeCold }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="冷凍溫度(°C)" align="center">
          <template #default="scope">
            <span :class="{ fail: scope.row.fridgeFreeze > -18 }">
              {{ scope.row.fridgeFreeze }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="檢體冰箱" align="center">
        <el-table-column label="冷藏溫度(°C)" align="center">
          <template #default="scope">
            <span
              :class="{
                fail:
                  scope.row.specimenFridge > 7 || scope.row.specimenFridge < 0,
              }"
            >
              {{ scope.row.specimenFridge }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="reports.length"
      @current-change="handlePageChange"
    />
  </el-card>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  subDays,
  startOfDay,
  format,
  parseISO,
  getDay,
  isAfter,
} from 'date-fns'
import * as XLSX from 'xlsx'
import { useReportTnhStore } from '../stores/reportsTnh'

const reportTnhStore = useReportTnhStore()
const { isLoading } = storeToRefs(reportTnhStore)
const { getReportTnh } = reportTnhStore

onMounted(() => {
  getReports()
})

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])
const dayOfTheWeek = ['日', '一', '二', '三', '四', '五', '六']
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

// pagination
const pageSize = ref(20)
const page = ref(1)
const handlePageChange = (p) => {
  page.value = p
}
const getTableData = computed(() =>
  reports.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)

//excel download
const handleDownload = () => {
  const sheetDate =
    format(dates.value[0], formatDate) +
    '~' +
    format(dates.value[1], formatDate)

  const reportsLength = reports.value.length
  const reportsAndAbnormalLength = reportsLength + abnormalRows.value.length

  const ws = XLSX.utils.aoa_to_sheet(
    [
      [
        '制定日期',
        format(new Date(), formatDate),
        '桃園市大竹國民小學',
        '',
        '',
        '',
        '文件編號',
        'DCES03',
      ],
      [
        '制定單位',
        '大竹國小',
        `庫房、食材、檢體保存溫度濕度紀錄表（民國${
          format(dates.value[0], 'yyyy') - 1911
        }年）`,
        '',
        '',
        '',
        '月份',
        `${format(dates.value[0], 'M')}月`,
      ],
      [''],
      [
        '項次',
        '日期',
        '星期',
        '庫房溫濕度',
        '',
        '食材冰箱',
        '',
        '檢體冰箱',
        '',
      ],
      [
        '',
        '',
        '',
        '溫度(°C)',
        '濕度(%)',
        '冷藏溫度(°C)',
        '冷凍溫度(°C)',
        '冷藏溫度(°C)',
      ],
    ]
      .concat(
        reports.value
          .slice(0)
          .sort((a, b) =>
            isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1
          )
          .map((row, i) => [
            i + 1,
            format(parseISO(row.date), f),
            dayOfTheWeek[getDay(parseISO(row.date))],
            row.warehouseTemp,
            row.warehouseHum,
            row.fridgeCold,
            row.fridgeFreeze,
            row.specimenFridge,
          ])
      )
      .concat([[]])
      .concat([[]])
      .concat([['項次', '日期', '異常項目', '異常說明', '', '', '', '']])
      .concat(
        abnormalRows.value
          .slice(0)
          .reverse()
          .map((row, i) => [i + 1, row.date, row.item, row.remarks])
      )
      .concat([['衛生管理人員', '', '', '營養師', '', '', '單位主管', '']])
  )

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 5, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 5, r: 1 } },
    // empty row
    { s: { c: 0, r: 2 }, e: { c: 7, r: 2 } },
    //header
    { s: { c: 0, r: 3 }, e: { c: 0, r: 4 } },
    { s: { c: 1, r: 3 }, e: { c: 1, r: 4 } },
    { s: { c: 2, r: 3 }, e: { c: 2, r: 4 } },
    { s: { c: 3, r: 3 }, e: { c: 4, r: 3 } },
    { s: { c: 5, r: 3 }, e: { c: 6, r: 3 } },
    //abnormal row
    {
      s: { c: 3, r: 7 + reportsLength },
      e: { c: 7, r: 7 + reportsLength },
    },
    ...abnormalRows.value.map((v, i) => ({
      s: { c: 3, r: 7 + reportsLength + i + 1 },
      e: { c: 7, r: 7 + reportsLength + i + 1 },
    })),
    //footer
    {
      s: { c: 0, r: 8 + reportsAndAbnormalLength },
      e: { c: 2, r: 8 + reportsAndAbnormalLength },
    },
    {
      s: { c: 3, r: 8 + reportsAndAbnormalLength },
      e: { c: 5, r: 8 + reportsAndAbnormalLength },
    },
    {
      s: { c: 6, r: 8 + reportsAndAbnormalLength },
      e: { c: 7, r: 8 + reportsAndAbnormalLength },
    },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}庫房食材檢體保存溫濕度報表`)

  XLSX.writeFile(wb, `${sheetDate}庫房食材檢體保存溫濕度報表.xlsx`)
}
</script>

<style lang="scss" scoped>
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

.el-button {
  margin-left: 20px;
}

:deep(.el-descriptions__cell) {
  display: block;
}
</style>
