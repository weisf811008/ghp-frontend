<template>
  <el-table :data="tableData" v-loading="isLoading" style="width: 100%">
    <el-table-column label="項次" align="center" width="60">
      <template #default="scope">
        {{ scope.$index + (page - 1) * pageSize + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="日期" align="center">
      <template #default="scope">
        {{ format(parseISO(scope.row.date), 'yyyy-MM-dd') }}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="星期" align="center">
      <template #default="scope">
        {{ dayOfTheWeek[getDay(parseISO(scope.row.date))] }}
      </template>
    </el-table-column>
    <el-table-column label="庫房溫濕度" align="center">
      <el-table-column label="溫度(°C)" align="center">
        <template #default="scope">
          <span :class="{ fail: scope.row.warehouseTemp >= 27 }">
            {{ scope.row.warehouseTemp }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="濕度(%)" align="center">
        <template #default="scope">
          <span :class="{ fail: scope.row.warehouseHum >= 65 }">
            {{ scope.row.warehouseHum }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="食材冰箱" align="center">
      <el-table-column label="冷藏溫度(°C)" align="center">
        <template #default="scope">
          <span
            :class="{
              fail: scope.row.fridgeCold > 7 || scope.row.fridgeCold < 0,
            }"
          >
            {{ scope.row.fridgeCold }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="冷凍溫度(°C)" align="center">
        <template #default="scope">
          <span :class="{ fail: scope.row.fridgeFreeze > -18 }">
            {{ scope.row.fridgeFreeze }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="檢體冰箱" align="center">
      <el-table-column label="冷藏溫度(°C)" align="center">
        <template #default="scope">
          <span
            :class="{
              fail:
                scope.row.specimenFridge > 7 || scope.row.specimenFridge < 0,
            }"
          >
            {{ scope.row.specimenFridge }}
          </span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { format, parseISO, getDay } from 'date-fns'

const props = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  dayOfTheWeek: {
    type: Array,
    default: [],
  },
  page: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 0,
  },
})
</script>

<style lang="scss" scoped></style>
