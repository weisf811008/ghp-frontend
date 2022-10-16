<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>統計圖表</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <div class="row">
      <div class="chart">
        <h3>檢核大項不合格數</h3>
        <AppPieChart v-loading="isLoading" :chartData="abnormalCategories" />
      </div>
      <div class="chart">
        <h3>GHP條文十大不合格</h3>
        <AppBarChart
          v-loading="isLoading"
          :chartData="abnormalGhp"
          :width="200"
          :height="100"
        />
      </div>
    </div>
    <div class="row">
      <div class="chart">
        <h3>檢核細項十大不合格</h3>
        <AppLineChart
          v-loading="isLoading"
          :chartData="abnormalItems"
          :width="200"
          :height="100"
        />
      </div>
      <div class="chart">
        <h3>訪視表條文十大不合格</h3>
        <AppBarChart
          v-loading="isLoading"
          :chartData="abnormalVisiting"
          :width="200"
          :height="100"
        />
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { subDays, startOfDay } from 'date-fns'
import { storeToRefs } from 'pinia'
import { useChartStore } from '../stores/charts'
import AppPieChart from '../components/charts/AppPieChart.vue'
import AppDoughnutChart from '../components/charts/AppPieChart.vue'
import AppLineChart from '../components/charts/AppLineChart.vue'

const chartStore = useChartStore()
const { isLoading } = storeToRefs(chartStore)

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

const loaded = ref(false)

const abnormalCategories = ref({})
const abnormalItems = ref({})
const abnormalGhp = ref({})
const abnormalVisiting = ref({})

const getAbnormalCategories = async () => {
  abnormalCategories.value = await chartStore.getAbnormalCategories(
    dates.value[0],
    dates.value[1]
  )
}

const getAbnormalItems = async () => {
  abnormalItems.value = await chartStore.getAbnormalItems(
    dates.value[0],
    dates.value[1]
  )
}

const getAbnormalGhp = async () => {
  abnormalGhp.value = await chartStore.getAbnormalGhp(
    dates.value[0],
    dates.value[1]
  )
}

const getAbnormalVisiting = async () => {
  abnormalVisiting.value = await chartStore.getAbnormalVisiting(
    dates.value[0],
    dates.value[1]
  )
}

onMounted(async () => {
  await getAbnormalCategories()
  await getAbnormalItems()
  await getAbnormalGhp()
  await getAbnormalVisiting()
})

const handleChange = () => {
  getAbnormalCategories()
  getAbnormalItems()
  getAbnormalGhp()
  getAbnormalVisiting()
}
</script>
<style lang="scss" scoped>
.row {
  width: 98%;
  display: flex;
  margin: 0 10px 10px 10px;

  .chart {
    width: 50%;
  }
}
</style>
