<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>GHP報表</h2>
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
            @change="handleChange"
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
    <el-table :data="getTableData" v-loading="isLoading" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="類別序號"
        fixed
        align="center"
        prop="code"
        width="100"
      />
      <el-table-column
        label="類別"
        fixed
        align="center"
        prop="class"
        width="170"
      />
      <el-table-column
        label="食品良好衛生規範法規GHP檢查"
        fixed
        prop="description"
        min-width="400"
      />
      <el-table-column
        label="合格次數"
        align="center"
        prop="status"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.pass.length }}
        </template>
      </el-table-column>
      <el-table-column
        label="不合格次數"
        align="center"
        prop="status"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.fail.length }}
        </template>
      </el-table-column>
      <el-table-column
        label="其他次數"
        align="center"
        prop="status"
        width="100"
      >
        <template #default="scope">
          {{ scope.row.others.length }}
        </template>
      </el-table-column>
      <el-table-column
        type="expand"
        label="詳細說明"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-descriptions>
            <el-descriptions-item label="合格項目：">
              {{ scope.row.pass.map(getStatusDetail).join(', ') }}
            </el-descriptions-item>
            <el-descriptions-item label="不合格項目：">
              {{ scope.row.fail.map(getStatusDetail).join(', ') }}
            </el-descriptions-item>
            <el-descriptions-item label="其他項目：">
              {{ scope.row.others.map(getStatusDetail).join(', ') }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
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
import { subDays, startOfDay, format } from 'date-fns'
import * as XLSX from 'xlsx'
import { useReportGhpStore } from '../stores/reportsGhp'

const reportGhpStore = useReportGhpStore()
const { isLoading } = storeToRefs(reportGhpStore)
const { getReportGhp } = reportGhpStore

onMounted(() => {
  getReports()
})

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])
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

const getReports = async () => {
  const [start, end] = dates.value
  reports.value = await getReportGhp(start.toISOString(), end.toISOString())
  reports.value.sort((a, b) => (a.code > b.code ? 1 : -1))
}

const handleChange = () => {
  getReports()
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

const getStatusDetail = ({ date, itemNo, remarks }) =>
  `${date}(${itemNo}${remarks ? ` ${remarks}` : ''})`

//excel download
const handleDownload = () => {
  const rows = reports.value.map((reg, i) => ({
    類別: reg.class,
    序號: reg.code,
    食品良好衛生規範法規GHP檢查: reg.description,
    合格次數: reg.pass.length,
    不合格次數: reg.fail.length,
    其他次數: reg.others.length,
    不合格日期及狀況: reg.fail.map(getStatusDetail).join(', '),
    合格日期: reg.pass.map(({ date }) => date).join(', '),
  }))

  const sheetDate =
    format(dates.value[0], formatDate) +
    '~' +
    format(dates.value[1], formatDate)
  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), formatDate),
      '桃園市大竹國民小學',
      '',
      '文件編號',
      'DCES06',
    ],
    [
      '制定單位',
      '大竹國小',
      `食品良好衛生規範法規GHP檢查表民國${
        format(dates.value[0], 'yyyy') - 1911
      }年）`,
      '',
      '檢查區間',
      `${sheetDate}`,
    ],
  ])

  XLSX.utils.sheet_add_json(ws, rows, {
    header: Object.keys(rows[0]),
    origin: 'A4',
  })

  XLSX.utils.sheet_add_aoa(
    ws,
    [['衛生管理人員', '', '營養師', '單位主管', '', '']],
    {
      origin: rows.length + 4,
    }
  )

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 3, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 3, r: 1 } },
    //empty row
    { s: { c: 0, r: 2 }, e: { c: 5, r: 2 } },
    //footer row
    {
      s: { c: 0, r: 4 + reports.value.length },
      e: { c: 1, r: 4 + reports.value.length },
    },
    {
      s: { c: 3, r: 4 + reports.value.length },
      e: { c: 5, r: 4 + reports.value.length },
    },
  ]
  ws['!cols'] = [
    { wch: 32 },
    { wch: 10 },
    { wch: 36 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}GHP報表`)

  XLSX.writeFile(wb, `${sheetDate}GHP報表.xlsx`)
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
