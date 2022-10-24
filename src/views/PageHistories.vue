<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>操作記錄</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <AppHistoryList :histories="histories" :isLoading="isLoading" />
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { useHistoriesStore } from '../stores/histories'

const historiesStore = useHistoriesStore()
const { isLoading } = storeToRefs(historiesStore)
const { getHistories } = historiesStore

onMounted(() => {
  getHistoriesData()
})

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

const histories = ref([])

const getHistoriesData = async () => {
  histories.value = await getHistories(
    startOfDay(dates.value[0]).toISOString(),
    endOfDay(dates.value[1]).toISOString()
  )
}

const handleChange = () => {
  getHistoriesData()
}
</script>

<style lang="scss" scoped></style>
