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
        <h3>檢核大項缺失次數</h3>
        <AppPieChart
          v-show="!abnormalCategoriesIsEmpty"
          v-loading="isLoading"
          :chartData="abnormalCategories"
        />
        <el-empty v-show="abnormalCategoriesIsEmpty" description="No data" />
      </div>
      <div class="chart">
        <h3>檢核大項合格次數</h3>
        <AppPieChart
          v-show="!normalCategoriesIsEmpty"
          v-loading="isLoading"
          :chartData="normalCategories"
        />
        <el-empty v-show="normalCategoriesIsEmpty" description="No data" />
      </div>
    </div>
    <div>
      <h3>檢核細項十大缺失</h3>
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
import AppPieChart from '../components/charts/AppPieChart.vue'
import AppDoughnutChart from '../components/charts/AppPieChart.vue'
import AppLineChart from '../components/charts/AppLineChart.vue'

const chartStore = useChartStore()
const { isLoading } = storeToRefs(chartStore)
const { getNormalCategories, getAbnormalCategories, getAbnormalItems } =
  chartStore

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 13), today])

const normalCategoriesIsEmpty = ref(false)
const abnormalCategoriesIsEmpty = ref(false)
const abnormalItemsIsEmpty = ref(false)

const normalCategories = ref({})
const abnormalCategories = ref({})
const abnormalItems = ref({})

const getNormalCategoriesData = async () => {
  normalCategories.value = await getNormalCategories(
    dates.value[0],
    dates.value[1]
  )
}

const getAbnormalCategoriesData = async () => {
  abnormalCategories.value = await getAbnormalCategories(
    dates.value[0],
    dates.value[1]
  )
}

const getAbnormalItemsData = async () => {
  abnormalItems.value = await getAbnormalItems(dates.value[0], dates.value[1])
}

onMounted(async () => {
  await getNormalCategoriesData()
  await getAbnormalCategoriesData()
  await getAbnormalItemsData()
})

const handleChange = () => {
  getNormalCategoriesData()
  getAbnormalCategoriesData()
  getAbnormalItemsData()
}

watch(
  () => normalCategories.value,
  (newValue) => {
    if (newValue.datasets.length === 0) {
      return (normalCategoriesIsEmpty.value = true)
    } else {
      return (normalCategoriesIsEmpty.value = false)
    }
  }
)

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
