<template>
  <el-table :data="tableData" v-loading="isLoading" style="width: 100%">
    <el-table-column label="項次" align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="日期" align="center">
      <template #default="scope">
        {{ format(parseISO(scope.row.date), 'yyyy-MM-dd') }}
      </template>
    </el-table-column>
    <el-table-column label="餐桶" align="center">
      <el-table-column label="外觀" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.diningBucketLook,
              fail: !scope.row.diningBucketLook,
            }"
          >
            {{ getDisplayText(scope.row.diningBucketLook) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="澱粉殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.diningBucketStarch,
              fail: !scope.row.diningBucketStarch,
            }"
          >
            {{ getDisplayText(scope.row.diningBucketStarch) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="脂肪殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.diningBucketFat,
              fail: !scope.row.diningBucketFat,
            }"
          >
            {{ getDisplayText(scope.row.diningBucketFat) }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="湯桶" align="center">
      <el-table-column label="外觀" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.soupBucketLook,
              fail: !scope.row.soupBucketLook,
            }"
          >
            {{ getDisplayText(scope.row.soupBucketLook) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="澱粉殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.soupBucketStarch,
              fail: !scope.row.soupBucketStarch,
            }"
          >
            {{ getDisplayText(scope.row.soupBucketStarch) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="脂肪殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.soupBucketFat,
              fail: !scope.row.soupBucketFat,
            }"
          >
            {{ getDisplayText(scope.row.soupBucketFat) }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="餐具" align="center">
      <el-table-column label="外觀" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.tablewareLook,
              fail: !scope.row.tablewareLook,
            }"
          >
            {{ getDisplayText(scope.row.tablewareLook) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="澱粉殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.tablewareStarch,
              fail: !scope.row.tablewareStarch,
            }"
          >
            {{ getDisplayText(scope.row.tablewareStarch) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="脂肪殘留檢驗" align="center">
        <template #default="scope">
          <span
            :class="{
              pass: scope.row.tablewareFat,
              fail: !scope.row.tablewareFat,
            }"
          >
            {{ getDisplayText(scope.row.tablewareFat) }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { format, parseISO } from 'date-fns'
import * as XLSX from 'xlsx'

const props = defineProps({
  tableData: {
    type: Array,
  },
  getDisplayText: {
    type: Function,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
})
</script>

<style lang="scss" scoped></style>
