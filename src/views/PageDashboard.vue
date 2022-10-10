<template>
  <div>
    <AppPieChart :chartData="abnormalCategories" />
    <AppLineChart :chartData="abnormalItems" />
    <AppLineChart :chartData="abnormalGhp" />
    <AppLineChart :chartData="abnormalVisiting" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { format } from 'date-fns'
import AppPieChart from '../components/charts/AppPieChart.vue'
import AppLineChart from '../components/charts/AppLineChart.vue'
import { useChartStore } from '../stores/charts'

const chartStore = useChartStore()

const dates = [new Date('2022-09-01'), new Date('2022-09-15')]
const abnormalCategories = ref({})
const abnormalItems = ref({})
const abnormalGhp = ref({})
const abnormalVisiting = ref({})

const getAbnormalCategories = async () => {
  abnormalCategories.value = await chartStore.getAbnormalCategories(
    dates[0],
    dates[1]
  )
}

const getAbnormalItems = async () => {
  abnormalItems.value = await chartStore.getAbnormalItems(dates[0], dates[1])
}

const getAbnormalGhp = async () => {
  abnormalGhp.value = await chartStore.getAbnormalGhp(dates[0], dates[1])
}

const getAbnormalVisiting = async () => {
  abnormalVisiting.value = await chartStore.getAbnormalVisiting(
    dates[0],
    dates[1]
  )
}

onMounted(async () => {
  await getAbnormalCategories()
  await getAbnormalItems()
  await getAbnormalGhp()
  await getAbnormalVisiting()
})
</script>
