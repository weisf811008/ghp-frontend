<template>
  <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
    <el-table-column label="項次" fixed align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column
      label="檢核大項"
      fixed
      align="center"
      prop="category"
      width="180"
    />
    <el-table-column label="編號" fixed prop="no" width="90" />
    <el-table-column label="檢核細項" fixed prop="item" min-width="400" />
    <el-table-column
      v-for="(j, i) in getPeriodInDays"
      :label="format(addDays(dates[0], i), 'MM/dd')"
      :key="`date-${i}`"
      prop="date"
      width="90"
      align="center"
    >
      <template #default="scope">
        <span
          :class="{
            pass: getStatus(scope.row, i) === 'pass',
            fail: getStatus(scope.row, i) === 'fail',
            others: getStatus(scope.row, i) === 'others',
          }"
        >
          {{ getStatusLabel(scope.row, i) }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { computed } from 'vue'
import { addDays, format, differenceInDays } from 'date-fns'
const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 0,
  },
  dates: {
    type: Array,
    default: [],
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  getStatus: {
    type: Function,
  },
  getStatusLabel: {
    type: Function,
  },
})

const getPeriodInDays = computed(
  () => differenceInDays(new Date(props.dates[1]), new Date(props.dates[0])) + 1
)
</script>

<style lang="scss" scoped></style>
