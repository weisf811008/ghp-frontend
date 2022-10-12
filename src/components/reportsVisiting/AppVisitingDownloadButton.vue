<template>
  <el-button
    type="primary"
    size="large"
    class="download-button"
    @click.prevent="handleDownload"
  >
    下載Excel
  </el-button>
</template>

<script setup>
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

const props = defineProps({
  dates: {
    type: Array,
    required: true,
  },
  reports: {
    type: Array,
    default: [],
  },
  getStatusDetail: {
    type: Function,
  },
})

//excel download
const handleDownload = () => {
  const formatDate = 'yyyyMMdd'

  const sheetDate =
    format(props.dates[0], formatDate) +
    '~' +
    format(props.dates[1], formatDate)

  const rows = props.reports.map((visit, i) => ({
    類別: visit.class,
    編號: visit.code,
    訪視項目: visit.description,
    合格次數: visit.pass.length,
    不合格次數: visit.fail.length,
    其他次數: visit.others.length,
    不合格日期及狀況: visit.fail.map(props.getStatusDetail).join(', '),
    合格日期: visit.pass.map(({ date }) => date).join(', '),
  }))

  const ws = XLSX.utils.aoa_to_sheet([
    [
      '制定日期',
      format(new Date(), formatDate),
      '桃園市大竹國民小學',
      '',
      '文件編號',
      'DCES07',
    ],
    [
      '制定單位',
      '大竹國小',
      `午餐輔導訪視表（${format(props.dates[0], 'yyyy') - 1911}年）`,
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
    //header row
    { s: { c: 0, r: 2 }, e: { c: 5, r: 2 } },
    //footer row
    {
      s: { c: 0, r: 4 + props.reports.length },
      e: { c: 1, r: 4 + props.reports.length },
    },
    {
      s: { c: 3, r: 4 + props.reports.length },
      e: { c: 5, r: 4 + props.reports.length },
    },
  ]
  ws['!cols'] = [
    { wch: 15 },
    { wch: 10 },
    { wch: 36 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 18 },
    { wch: 10 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}訪視表報表`)

  XLSX.writeFile(wb, `${sheetDate}訪視表報表.xlsx`)
}
</script>

<style lang="scss" scoped></style>
