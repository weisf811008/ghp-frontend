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
import * as XLSX from 'xlsx'
import { addDays, format, differenceInDays, isAfter } from 'date-fns'

const props = defineProps({
  dates: {
    type: Array,
    required: true,
  },
  reports: {
    type: Array,
    default: [],
  },
  abnormalRows: {
    type: Array,
    default: [],
  },
  statusMap: {
    type: Object,
    default: () => ({}),
  },
})

const handleDownload = () => {
  const formatDate = 'yyyyMMdd'

  const sheetDate =
    format(props.dates[0], formatDate) +
    '~' +
    format(props.dates[1], formatDate)

  const reportsLength = props.reports.length
  const reportsAndAbnormalLength = reportsLength + props.abnormalRows.length

  const diff =
    differenceInDays(new Date(props.dates[1]), new Date(props.dates[0])) + 1
  const dateArr = Array(diff)
    .fill(new Date(props.dates[0]))
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
      '',
    ],
    [
      '制定單位',
      '大竹國小',
      `每日衛生管理日誌(民國${format(props.dates[0], 'yyyy') - 1911}年）`,
      '',
      '',
      '',
      '',
      '版次',
      '',
      '1.0',
      '',
    ],
    [''],
    [
      '項次',
      '檢核大項',
      '編號',
      '檢核細項',
      '',
      ...dateArr.map((d) => format(d, 'MM/dd')),
      '備註',
    ],
    ...props.reports.map(({ no, category, item, ...rest }, i) => {
      return [
        i + 1,
        category,
        no,
        item,
        '',
        ...dateArr.map((d) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          return props.statusMap[rest[dateStr]] || ''
        }),
      ]
    }),
    [''],
    [''],
    [
      '項次',
      '日期',
      '檢核大項',
      '編號',
      '異常細項',
      '異常說明',
      '',
      '',
      '',
      '',
      '',
    ],

    ...props.abnormalRows
      .slice(0)
      .sort((a, b) => (isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1))
      .map((row, i) => [
        i + 1,
        row.date,
        row.category,
        row.no,
        row.item,
        row.remarks,
        '',
        '',
        '',
        '',
        '',
      ]),

    ['衛生管理人員', '', '', '營養師', '', '單位主管', '', '', '', '', ''],
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
    // header
    { s: { c: 3, r: 3 }, e: { c: 4, r: 3 } },
    // reports row
    ...props.reports.map((v, i) => ({
      s: { c: 3, r: 3 + i + 1 },
      e: { c: 4, r: 3 + i + 1 },
    })),
    // abnormal row header

    {
      s: { c: 5, r: 6 + reportsLength },
      e: { c: 10, r: 6 + reportsLength },
    },
    ...props.abnormalRows.map((v, i) => ({
      s: { c: 5, r: 6 + reportsLength + i + 1 },
      e: { c: 10, r: 6 + reportsLength + i + 1 },
    })),
    //footer row
    {
      s: { c: 0, r: 7 + reportsAndAbnormalLength },
      e: { c: 2, r: 7 + reportsAndAbnormalLength },
    },
    {
      s: { c: 3, r: 7 + reportsAndAbnormalLength },
      e: { c: 4, r: 7 + reportsAndAbnormalLength },
    },
    {
      s: { c: 5, r: 7 + reportsAndAbnormalLength },
      e: { c: 10, r: 7 + reportsAndAbnormalLength },
    },
  ]
  ws['!cols'] = [
    { wch: 10 },
    { wch: 16 },
    { wch: 16 },
    { wch: 10 },
    { wch: 36 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
    { wch: 6 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}每日衛生管理日誌`)

  XLSX.writeFile(wb, `${sheetDate}每日衛生管理日誌.xlsx`)
}
</script>
