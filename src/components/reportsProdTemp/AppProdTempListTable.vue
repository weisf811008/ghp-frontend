<template>
  <el-table :data="tableData" v-loading="isLoading" table-layout="auto">
    <el-table-column label="項次" fixed align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="日期" align="center">
      <template #default="scope">
        {{ format(parseISO(scope.row.date), 'yyyy-MM-dd') }}
      </template>
    </el-table-column>
    <el-table-column label="成品確實封蓋" align="center">
      <template #default="scope">
        <span
          :class="{
            pass: scope.row.wasCovered,
            fail: !scope.row.wasCovered,
          }"
        >
          {{ getDisplayText(scope.row.wasCovered) }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="主食" align="center" prop="starter" />
    <el-table-column label="主菜" align="center" prop="mainCourse" />
    <el-table-column label="副菜" align="center" prop="sideDish" />
    <el-table-column label="青菜" align="center" prop="vegetable" />
  </el-table>
</template>

<script setup>
import { format, parseISO } from 'date-fns'

const props = defineProps({
  tableData: {
    type: Array,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  getDisplayText: {
    type: Function,
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
