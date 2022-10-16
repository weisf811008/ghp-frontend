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
import { format, parseISO, getDay, isAfter } from 'date-fns'
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
  dayOfTheWeek: {
    type: Array,
    default: [],
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
        '文件編號',
        'DCES03',
      ],
      [
        '制定單位',
        '大竹國小',
        `庫房、食材、檢體保存溫度濕度紀錄表（民國${
          format(props.dates[0], 'yyyy') - 1911
        }年）`,
        '',
        '',
        '',
        '月份',
        `${format(props.dates[0], 'M')}月`,
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
        props.reports
          .slice(0)
          .sort((a, b) =>
            isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1
          )
          .map((row, i) => [
            i + 1,
            format(parseISO(row.date), 'yyyy-MM-dd'),
            props.dayOfTheWeek[getDay(parseISO(row.date))],
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
        props.abnormalRows
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
    ...props.abnormalRows.map((v, i) => ({
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

<style lang="scss" scoped></style>
