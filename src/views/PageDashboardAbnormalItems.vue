<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核細項十大缺失</h2>
        <span class="block">
          <span class="selectDate">請選擇月份</span>
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="請選擇月份"
            size="large"
            @change="handleChange"
          />
        </span>
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
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { storeToRefs } from 'pinia'
import { useChartStore } from '../stores/charts'
import AppBarChart from '../components/charts/AppBarChart.vue'

const chartStore = useChartStore()
const { isLoading } = storeToRefs(chartStore)
const { getAbnormalItems } = chartStore

//date picker
const month = ref(format(new Date(), 'yyyy-MM'))

const abnormalItemsIsEmpty = ref(false)
const abnormalItems = ref({})

const getAbnormalItemsData = async () => {
  const date = new Date(month.value)
  const startDate = startOfMonth(date)
  const endDate = endOfMonth(date)
  abnormalItems.value = await getAbnormalItems(startDate, endDate)
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
