<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>操作記錄</h2>
        <AppSelectDate v-model:dateRange="dates" :handleChange="handleChange" />
      </div>
    </template>
    <AppAdminHistoryList
      :adminHistories="adminHistories"
      :isLoading="isLoading"
      :schoolsMap="schoolsMap"
    />
  </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { useAdminHistoriesStore } from '../stores/adminHistories'
import { useAdminSchoolStore } from '../stores/adminSchool'

const adminHistoriesStore = useAdminHistoriesStore()
const { isLoading } = storeToRefs(adminHistoriesStore)
const { getAdminHistories } = adminHistoriesStore

const adminSchoolStore = useAdminSchoolStore()
const { schools } = storeToRefs(adminSchoolStore)
const { getSchools } = adminSchoolStore

const schoolsMap = ref({})

onMounted(async () => {
  await getAdminHistoriesData()
  await getSchools()

  schoolsMap.value = schools.value.reduce((acc, cur) => {
    acc[cur.id] = cur.name
    return acc
  }, {})
})

//date picker
const dateRange = ref([])
const today = startOfDay(new Date())
const dates = ref([subDays(today, 6), today])

const adminHistories = ref([])

const getAdminHistoriesData = async () => {
  adminHistories.value = await getAdminHistories(
    startOfDay(dates.value[0]).toISOString(),
    endOfDay(dates.value[1]).toISOString()
  )
}

const handleChange = () => {
  getAdminHistoriesData()
}
</script>

<style lang="scss" scoped></style>
