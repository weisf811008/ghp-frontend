<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核大項缺失次數</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <div class="chart">
      <AppPieChart
        v-show="!abnormalCategoriesIsEmpty"
        v-loading="isLoading"
        :chartData="abnormalCategories"
      />
      <el-empty v-show="abnormalCategoriesIsEmpty" description="No data" />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { subDays, startOfDay } from 'date-fns'
import { storeToRefs } from 'pinia'
import { useChartStore } from '../stores/charts'
import AppPieChart from '../components/charts/AppPieChart.vue'

const chartStore = useChartStore()
const { isLoading } = storeToRefs(chartStore)
const { getAbnormalCategories } = chartStore

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 13), today])

const abnormalCategoriesIsEmpty = ref(false)

const abnormalCategories = ref({})

const getAbnormalCategoriesData = async () => {
  abnormalCategories.value = await getAbnormalCategories(
    dates.value[0],
    dates.value[1]
  )
}

onMounted(async () => {
  await getAbnormalCategoriesData()
})

const handleChange = () => {
  getAbnormalCategoriesData()
}

watch(
  () => abnormalCategories.value,
  (newValue) => {
    if (newValue.datasets.length === 0) {
      return (abnormalCategoriesIsEmpty.value = true)
    } else {
      return (abnormalCategoriesIsEmpty.value = false)
    }
  }
)
</script>
<style lang="scss" scoped>
.chart {
  height: 100%;
}
</style>
