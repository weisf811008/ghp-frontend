<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>成品中心溫度報表</h2>
        <div class="block">
          <span class="selectDate">請選擇日期區間</span>
          <el-date-picker
            v-model="dates"
            type="daterange"
            :disabled-date="disabledDate"
            unlink-panels
            range-separator="To"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
            :shortcuts="shortcuts"
            @change="getReports"
          />
          <el-button type="primary" @click="handleDownload">
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
      <el-table-column label="日期" align="center">
        <template #default="scope">
          {{ format(parseISO(scope.row.date), f) }}
        </template>
      </el-table-column>
      <el-table-column label="成品確實封蓋" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.wasCovered,
              fail: !scope.row.wasCovered,
            }"
          >
            {{ getDisplayText(scope.row.wasCovered) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="主食" align="center" prop="starter" />
      <el-table-column label="主菜" align="center" prop="mainCourse" />
      <el-table-column label="副菜" align="center" prop="sideDish" />
      <el-table-column label="青菜" align="center" prop="vegetable" />
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
import { subDays, startOfDay, format } from 'date-fns'
import * as XLSX from 'xlsx'
import { useReportProdtempStore } from '../stores/reportsProdtemp'
import parseISO from 'date-fns/esm/fp/parseISO/index.js'

const reportProdtempStore = useReportProdtempStore()
const { isLoading } = storeToRefs(reportProdtempStore)
const { getReportProdtemp } = reportProdtempStore

onMounted(() => {
  getReports()
})

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])
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

//excel download
const handleDownload = () => {
  const sheetDate =
    format(dates.value[0], formatDate) +
    '~' +
    format(dates.value[1], formatDate)
  const ws = XLSX.utils.aoa_to_sheet(
    [
      [
        '制定日期',
        format(new Date(), formatDate),
        '桃園市大竹國民小學',
        '',
        '',
        '文件編號',
        'DCES02',
      ],
      [
        '制定單位',
        '大竹國小',
        `成品中心溫度記錄表（民國${format(dates.value[0], 'yyyy') - 1911}年）`,
        '',
        '',
        '月份',
        `${format(dates.value[0], 'M')}月`,
      ],
      [],
      ['項次', '日期', '成品確實封蓋', '主食', '主菜', '副菜', '青菜'],
    ]
      .concat(
        reports.value.map((row, i) => [
          i + 1,
          format(parseISO(row.date), f),
          getDisplayText(row.wasCovered),
          row.starter,
          row.mainCourse,
          row.sideDish,
          row.vegetable,
        ])
      )
      .concat([[]])
      .concat([[]])
      .concat([['項次', '日期', '異常項目', '異常說明', '', '', '']])
      .concat(
        abnormalRows.value.map((row, i) => [
          i + 1,
          row.date,
          row.item,
          row.remarks,
        ])
      )
      .concat([['衛生管理人員', '', '', '營養師', '', '單位主管', '']])
  )

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 4, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 4, r: 1 } },
    //empty row
    { s: { c: 0, r: 2 }, e: { c: 6, r: 2 } },
    //abnormal row
    {
      s: { c: 3, r: 6 + reports.value.length },
      e: { c: 6, r: 6 + reports.value.length },
    },
    ...abnormalRows.value.map((v, i) => ({
      s: { c: 3, r: 6 + reports.value.length + i + 1 },
      e: { c: 6, r: 6 + reports.value.length + i + 1 },
    })),
    //footer rows
    {
      s: { c: 0, r: 7 + reports.value.length + abnormalRows.value.length },
      e: { c: 2, r: 7 + reports.value.length + abnormalRows.value.length },
    },
    {
      s: { c: 3, r: 7 + reports.value.length + abnormalRows.value.length },
      e: { c: 4, r: 7 + reports.value.length + abnormalRows.value.length },
    },
    {
      s: { c: 5, r: 7 + reports.value.length + abnormalRows.value.length },
      e: { c: 6, r: 7 + reports.value.length + abnormalRows.value.length },
    },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}成品中心溫度報表`)

  XLSX.writeFile(wb, `${sheetDate}成品中心溫度報表.xlsx`)
}

// pagination
const pageSize = ref(10)
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
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

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

  .pages {
    justify-content: flex-end;
  }
}

:deep(.el-descriptions__cell) {
  display: block;
}
</style>
