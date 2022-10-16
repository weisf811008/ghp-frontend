<template>
  <span class="block">
    <span class="selectDate">請選擇日期區間</span>
    <el-date-picker
      v-model="selectDates"
      type="daterange"
      size="large"
      :disabled-date="disabledDate"
      unlink-panels
      range-separator="To"
      start-placeholder="起始日期"
      end-placeholder="結束日期"
      :shortcuts="shortcuts"
      @change="handleChange"
    />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  handleChange: {
    type: Function,
  },
  dateRange: {
    type: Array,
    default: [],
  },
})

const emit = defineEmits(['update:dateRange'])

const selectDates = computed({
  get: () => props.dateRange,
  set: (val) => emit('update:dateRange', val),
})

const shortcuts = [
  {
    text: '上週',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '前三個月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const disabledDate = (time) => time.getTime() > Date.now()
</script>

<style lang="scss" scoped>
.block {
  align-items: center;
  color: rgb(96, 98, 102);

  .selectDate {
    margin-right: 10px;
    font-size: 14px;
  }
}
</style>
