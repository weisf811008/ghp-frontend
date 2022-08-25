<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>成品溫度報表</h2>
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
    <el-table :data="regulations" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
        align="center"
        prop="date"
      />
      <el-table-column
        label="成品確實封蓋"
        align="center"
        prop="check"
      />
      <el-table-column
        label="主食"
        align="center"
        prop="firstCourse"
      />
      <el-table-column
        label="主菜"
        align="center"
        prop="mainCourse"
      />
      <el-table-column
        label="副菜"
        align="center"
        prop="sideDish"
      />
      <el-table-column
        label="青菜"
        align="center"
        prop="vegetable"
      />
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
    日期: reg.class,
    成品確實封蓋: reg.code,
    主食: reg.code,
    主菜: reg.code,
    副菜: reg.code,
    青菜: reg.code,
  }))

  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), 'yyyyMMdd'),
      '桃園市大竹國民小學',
      '',
      '文件編號',
      'DCES02',
    ],
    [
      '制定單位',
      '大竹國小',
      `成品中心溫度記錄表（民國${format(dates.value[0], 'yyyy')-1911}年）`,
      '',
      '月份',
      `${format(dates.value[0], 'MM')}`,
    ],
    [
      '日期',
      '異常項目',
      '',
      '',
      '',
      '',
    ],
    [
      '衛生管理人員',
      '',
      '營養師',
      '',
      '單位主管',
      ''
    ]
  ])

  XLSX.utils.sheet_add_json(ws, rows, {
    header: Object.keys(rows[0]),
    origin: 'A4',
  })

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 3, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 3, r: 1 } },
    //empty row
    { s: { c: 0, r: 2 }, e: { c: 5, r: 2 } },
    //abnormal rows
    { s: { c: 2, r: 3 + dates.value.length }, e: { c: 5, r: 3 + dates.value.length } },
    //footer rows
    { s: { c: 0, r: 4 + dates.value.length }, e: { c: 1, r: 4 + dates.value.length } },
    { s: { c: 2, r: 4 + dates.value.length }, e: { c: 3, r: 4 + dates.value.length } },
    { s: { c: 4, r: 4 + dates.value.length }, e: { c: 5, r: 4 + dates.value.length } },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '成品溫度報表')

  XLSX.writeFile(wb, '成品溫度報表.xlsx')
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
