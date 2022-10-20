<template>
  <el-date-picker
    v-model="dateData"
    type="date"
    size="large"
    value-format="YYYY-MM-DD"
    :disabled-date="disabledDate"
  />
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:dateData'])

const dateData = computed({
  get: () => props.dateData,
  set: (val) => emit('update:dateData', val),
})

const props = defineProps({
  dateData: {
    type: String,
    default: '',
  },
  disabledDate: {
    type: Function,
    required: true,
  },
})
</script>

<style lang="scss" scoped></style>
