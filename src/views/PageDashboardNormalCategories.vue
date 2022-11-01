<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核大項合格次數</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <div>
      <AppPieChart
        v-show="!normalCategoriesIsEmpty"
        v-loading="isLoading"
        :chartData="normalCategories"
      />
      <el-empty v-show="normalCategoriesIsEmpty" description="No data" />
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
const { getNormalCategories } = chartStore

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 13), today])

const normalCategoriesIsEmpty = ref(false)

const normalCategories = ref({})

const getNormalCategoriesData = async () => {
  normalCategories.value = await getNormalCategories(
    dates.value[0],
    dates.value[1]
  )
}

onMounted(async () => {
  await getNormalCategoriesData()
})

const handleChange = () => {
  getNormalCategoriesData()
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
</script>
<style lang="scss" scoped></style>
