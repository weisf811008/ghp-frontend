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
import { addDays, format, differenceInDays } from 'date-fns'

const props = defineProps({
  dates: {
    type: Array,
    required: true,
  },
  reports: {
    type: Array,
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
    ...props.reports.map(({ category, item, ...rest }, i) => {
      return [
        i + 1,
        category,
        item,
        '',
        ...dateArr.map((d) => {
          const dateStr = format(d, 'yyyy-MM-dd')
          return props.statusMap[rest[dateStr]] || ''
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
    ...Array(props.reports.length)
      .fill()
      .map((v, i) => ({
        s: { c: 2, r: 4 + i },
        e: { c: 3, r: 4 + i },
      })),
    //footer row
    {
      s: { c: 0, r: 4 + props.reports.length },
      e: { c: 2, r: 4 + props.reports.length },
    },
    {
      s: { c: 3, r: 4 + props.reports.length },
      e: { c: 6, r: 4 + props.reports.length },
    },
    {
      s: { c: 7, r: 4 + props.reports.length },
      e: { c: 10, r: 4 + props.reports.length },
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
</script>
