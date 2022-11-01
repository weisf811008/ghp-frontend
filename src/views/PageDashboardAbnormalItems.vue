<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核細項十大缺失</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <div>
      <AppBarChart
        v-show="!abnormalItemsIsEmpty"
        v-loading="isLoading"
        :chartData="abnormalItems"
      />
      <el-empty v-show="abnormalItemsIsEmpty" description="No data" />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { subDays, startOfDay } from 'date-fns'
import { storeToRefs } from 'pinia'
import { useChartStore } from '../stores/charts'
import AppBarChart from '../components/charts/AppBarChart.vue'

const chartStore = useChartStore()
const { isLoading } = storeToRefs(chartStore)
const { getAbnormalItems } = chartStore

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 13), today])

const abnormalItemsIsEmpty = ref(false)

const abnormalItems = ref({})

const getAbnormalItemsData = async () => {
  abnormalItems.value = await getAbnormalItems(dates.value[0], dates.value[1])
}

onMounted(async () => {
  await getAbnormalItemsData()
})

const handleChange = () => {
  getAbnormalItemsData()
}

watch(
  () => abnormalItems.value,
  (newValue) => {
    if (newValue.datasets.length === 0) {
      return (abnormalItemsIsEmpty.value = true)
    } else {
      return (abnormalItemsIsEmpty.value = false)
    }
  }
)
</script>
<style lang="scss" scoped></style>
