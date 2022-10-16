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
import { format, parseISO, isAfter } from 'date-fns'
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
  abnormalRows: {
    type: Array,
    default: [],
  },
  getDisplayText: {
    type: Function,
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

  const ws = XLSX.utils.aoa_to_sheet(
    [
      [
        '制定日期',
        format(new Date(), formatDate),
        '桃園市大竹國民小學',
        '',
        '',
        '',
        '',
        '',
        '',
        '文件編號',
        'DCES04',
      ],
      [
        '制定單位',
        '大竹國小',
        `餐具檢驗報表（民國${format(props.dates[0], 'yyyy') - 1911}年）`,
        '',
        '',
        '',
        '',
        '',
        '',
        '月份',
        `${format(props.dates[0], 'M')}月`,
      ],
      ['頻率：每週至少抽驗一次，V：表示合格  X：表示不合格，不合格立即改善'],
      ['項次', '日期', '餐桶', '', '', '湯桶', '', '', '餐具', '', ''],
      [
        '',
        '',
        '外觀',
        '澱粉殘留檢驗',
        '脂肪殘留檢驗',
        '外觀',
        '澱粉殘留檢驗',
        '脂肪殘留檢驗',
        '外觀',
        '澱粉殘留檢驗',
        '脂肪殘留檢驗',
      ],
    ]
      .concat(
        props.reports
          .slice(0)
          .reverse()
          .map((row, i) => [
            i + 1,
            format(parseISO(row.date), 'yyyy-MM-dd'),
            props.getDisplayText(row.diningBucketLook),
            props.getDisplayText(row.diningBucketStarch),
            props.getDisplayText(row.diningBucketFat),
            props.getDisplayText(row.soupBucketLook),
            props.getDisplayText(row.soupBucketStarch),
            props.getDisplayText(row.soupBucketFat),
            props.getDisplayText(row.tablewareLook),
            props.getDisplayText(row.tablewareStarch),
            props.getDisplayText(row.tablewareStarch),
          ])
      )
      .concat([[]])
      .concat([[]])
      .concat([
        ['項次', '日期', '異常項目', '異常說明', '', '', '', '', '', '', ''],
      ])
      .concat(
        props.abnormalRows
          .slice(0)
          .sort((a, b) =>
            isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1
          )
          .map((row, i) => [i + 1, row.date, row.item, row.remarks])
      )
      .concat([
        ['衛生管理人員', '', '', '', '營養師', '', '', '', '單位主管', '', ''],
      ])
  )

  ws['!merges'] = [
    //info rows
    { s: { c: 2, r: 0 }, e: { c: 8, r: 0 } },
    { s: { c: 2, r: 1 }, e: { c: 8, r: 1 } },
    //comment row
    { s: { c: 0, r: 2 }, e: { c: 10, r: 2 } },
    //header rows
    { s: { c: 0, r: 3 }, e: { c: 0, r: 4 } },
    { s: { c: 1, r: 3 }, e: { c: 1, r: 4 } },
    { s: { c: 2, r: 3 }, e: { c: 4, r: 3 } },
    { s: { c: 5, r: 3 }, e: { c: 7, r: 3 } },
    { s: { c: 8, r: 3 }, e: { c: 10, r: 3 } },
    //abnormal row
    {
      s: { c: 3, r: 7 + reportsLength },
      e: { c: 10, r: 7 + reportsLength },
    },
    ...props.abnormalRows.map((v, i) => ({
      s: { c: 3, r: 7 + reportsLength + i + 1 },
      e: { c: 10, r: 7 + reportsLength + i + 1 },
    })),
    //footer
    {
      s: { c: 0, r: 8 + reportsAndAbnormalLength },
      e: { c: 3, r: 8 + reportsAndAbnormalLength },
    },
    {
      s: { c: 4, r: 8 + reportsAndAbnormalLength },
      e: { c: 7, r: 8 + reportsAndAbnormalLength },
    },
    {
      s: { c: 8, r: 8 + reportsAndAbnormalLength },
      e: { c: 10, r: 8 + reportsAndAbnormalLength },
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
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, `${sheetDate}餐具檢驗報表`)

  XLSX.writeFile(wb, `${sheetDate}餐具檢驗報表.xlsx`)
}
</script>

<style lang="scss" scoped></style>
