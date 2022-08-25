<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>庫房、食材、檢體保存溫濕度報表</h2>
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
            @change="handleChange"
          />
          <el-button type="primary" @click="handleDownload">
            下載Excel
          </el-button>
        </div>
      </div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="項次"  align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
    <el-table-column prop="date" label="日期" align="center" />
    <el-table-column prop="date" label="星期" align="center" />
    <el-table-column label="庫房溫濕度" align="center" >
      <el-table-column prop="name" label="溫度(°C)" align="center"/>
      <el-table-column prop="name" label="濕度(%)" align="center"/>
    </el-table-column>
    <el-table-column label="食材冰箱" align="center">
      <el-table-column prop="name" label="冷藏溫度(°C)" align="center"/>
      <el-table-column prop="name" label="冷凍溫度(°C)" align="center"/>
    </el-table-column>
    <el-table-column label="檢體冰箱" align="center">
      <el-table-column prop="name" label="冷藏溫度(°C)" align="center"/>
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
import { subDays, startOfDay, format } from 'date-fns'
import * as XLSX from 'xlsx'
import { useRegulationStore } from '../stores/regulations'
import { useReportStore } from '../stores/reports'

const regulationStore = useRegulationStore()
const { regulations } = storeToRefs(regulationStore)
const { getRegulations } = regulationStore

const reportStore = useReportStore()
const { getReportGhp } = reportStore

//date picker
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])
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

// pagination
const filterData = ref([])
// const pageSize = ref(10)
// const page = ref(1)
// const getFilteredData = computed(() => filterData);

// const getTableData = computed(() =>
//   filterData().slice(
//     (page.value - 1) * pageSize.value,
//     page.value * pageSize.value
//   )
// )

const reports = ref({})

const getReports = async () => {
  const [start, end] = dates.value
  const f = 'yyyy-MM-dd'
  reports.value = await getReportGhp(format(start, f), format(end, f))
}

const handleChange = () => {
  getReports()
}

const handleDownload = () => {
  const rows = regulations.value.map((reg, i) => ({
    // 類別: reg.class,
    // 序號: reg.code,
    // 食品良好衛生規範法規GHP檢查: reg.description,
    // 合格次數: reports.value[reg.code] ? reports.value[reg.code].pass.length : 0,
    // 不合格次數: reports.value[reg.code]
    //   ? reports.value[reg.code].fail.length
    //   : 0,
    // 其他次數: reports.value[reg.code]
    //   ? reports.value[reg.code].others.length
    //   : 0,
    // 不合格日期及狀況: reports.value[reg.code]
    //   ? reports.value[reg.code].fail.join(', ')
    //   : '',
    // 合格日期: reports.value[reg.code]
    //   ? reports.value[reg.code].pass.join(', ')
    //   : '',
  }))

  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), 'yyyyMMdd'),
      '桃園市大竹國民小學',
      '',
      '',
      '文件編號',
      'DCES03',
    ],
    [
      '制定單位',
      '大竹國小',
      `庫房、食材、檢體保存溫度濕度紀錄表（民國${format(dates.value[0], 'yyyy')-1911}年）`,
      '',
      '',
      '月份',
      `${format(dates.value[0], 'MM')}`,
    ],
    [],
    [
      '日期',
      '星期',
      '庫房溫濕度',
      '',
      '食材冰箱',
      '',
      '檢體冰箱'
    ],
    [
      '',
      '',
      '溫度(°C)',
      '濕度(%)',
      '冷藏溫度(°C)',
      '冷凍溫度(°C)',
      '冷藏溫度(°C)'
    ],
    [
      '日期',
      '異常項目',
      '異常說明',
      '',
      '',
      '',
      '',
    ],
    [
      '衛生管理人員',
      '',
      '',
      '營養師',
      '',
      '單位主管',
      '',
    ]
  ])

  XLSX.utils.sheet_add_json(ws, rows, {
    header: Object.keys(rows[0]),
    origin: 'A4',
  })

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 4, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 4, r: 1 } },
    // empty row
    { s: { c: 0, r: 2 }, e: { c: 6, r: 2 } },
    //header
    { s: { c: 0, r: 3 }, e: { c: 0, r: 4 } },
    { s: { c: 1, r: 3 }, e: { c: 1, r: 4 } },
    { s: { c: 2, r: 3 }, e: { c: 3, r: 3 } },
    { s: { c: 4, r: 3 }, e: { c: 5, r: 3 } },
    //abnormal rows
    { s: { c: 2, r: 5 + dates.value.length }, e: { c: 6, r: 5 + dates.value.length } },
    //footer
    { s: { c: 0, r: 6 + dates.value.length}, e: { c: 2, r: 6 + dates.value.length} },
    { s: { c: 3, r: 6 + dates.value.length}, e: { c: 4, r: 6 + dates.value.length} },
    { s: { c: 5, r: 6 + dates.value.length}, e: { c: 6, r: 6 + dates.value.length} },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '庫房、食材、檢體保存溫度濕度紀錄報表')

  XLSX.writeFile(wb, '庫房、食材、檢體保存溫度濕度紀錄報表.xlsx')
}

const handlePageChange = (p) => {
  page.value = p
}

onMounted(() => {
  getRegulations()
  getReports()
})
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

  .pages {
    justify-content: flex-end;
  }
}

:deep(.el-descriptions__cell) {
  display: block;
}
</style>
