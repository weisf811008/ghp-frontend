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
import { format, isAfter, parseISO } from 'date-fns'
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
        '文件編號',
        'DCES02',
      ],
      [
        '制定單位',
        '大竹國小',
        `成品中心溫度記錄表（民國${format(props.dates[0], 'yyyy') - 1911}年）`,
        '',
        '',
        '月份',
        `${format(props.dates[0], 'M')}月`,
      ],
      [],
      ['項次', '日期', '成品確實封蓋', '主食', '主菜', '副菜', '青菜'],
    ]
      .concat(
        props.reports
          .slice(0)
          .reverse()
          .map((row, i) => [
            i + 1,
            format(parseISO(row.date), 'yyyy-MM-dd'),
            props.getDisplayText(row.wasCovered),
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
        props.abnormalRows
          .slice(0)
          .sort((a, b) =>
            isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1
          )
          .map((row, i) => [i + 1, row.date, row.item, row.remarks])
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
      s: { c: 3, r: 6 + reportsLength },
      e: { c: 6, r: 6 + reportsLength },
    },
    ...props.abnormalRows.map((v, i) => ({
      s: { c: 3, r: 6 + reportsLength + i + 1 },
      e: { c: 6, r: 6 + reportsLength + i + 1 },
    })),
    //footer rows
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
      e: { c: 6, r: 7 + reportsAndAbnormalLength },
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
</script>

<style lang="scss" scoped></style>
