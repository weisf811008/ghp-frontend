<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢紀錄填報</h2>
      </div>
    </template>
    <AppInspectionSubmittingListTable
      :form="form"
      :isLoading="isLoading"
      :rules="rules"
      :newData="newData"
      :create="createInspection"
      :formDetailMap="formDetailMap"
      :inspectionDetailMap="inspectionDetailMap"
      :mbExpandButtonIcon="mbExpandButtonIcon"
      :handleMbExpandChange="handleMbExpandChange"
    />
  </el-card>
</template>
<script setup>
import { ref, onMounted, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { format } from 'date-fns'
import { useFormStore } from '../stores/form'
import { useInspectionStore } from '../stores/inspection'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'
import AppInspectionSubmittingListTable from '../components/inspectionSubmitting/AppInspectionSubmittingListTable.vue'

const formStore = useFormStore()
const { getFormById } = formStore

const inspectionStore = useInspectionStore()
const { isLoading } = storeToRefs(inspectionStore)
const { createInspection } = inspectionStore

const router = useRouter()
const route = useRoute()

const rules = ref({
  date: [
    {
      type: 'date',
      required: true,
      message: '此欄位不得為空',
      trigger: ['blur', 'change'],
    },
  ],
  dueDate: [
    {
      type: 'date',
      message: '請選擇一個日期',
      trigger: ['blur', 'change'],
    },
  ],
})

const form = ref({
  id: null,
  details: [],
})

const search = ref('')
const formDetailMap = ref({})
const inspectionDetailMap = ref({})

const newData = ref({
  date: format(new Date(), 'yyyy-MM-dd'),
  dueDate: '',
  checkValue: '',
  remarks: '',
  formId: null,
  details: [],
})

const mbExpandButtonIcon = ref({})

const handleMbExpandChange = (row, expandedRows) => {
  const isExpanded = expandedRows.some((r) => r.itemId === row.itemId)
  mbExpandButtonIcon.value[`${row.itemId}`] = isExpanded
    ? h(ArrowUpBold)
    : h(ArrowDownBold)
}

onMounted(async () => {
  const formId = route.params.formId

  if (!formId) {
    router.push({ name: 'Inspection' })
    return
  }

  try {
    form.value = await getFormById(formId)
  } catch (e) {
    router.push({ name: 'Inspection' })
    return
  }

  if (!form.value) {
    router.push({ name: 'Inspection' })
    return
  }

  formDetailMap.value = form.value.details.reduce((acc, cur) => {
    if (!acc[cur.category]) {
      acc[cur.category] = []
    }
    acc[cur.category].push(cur)
    return acc
  }, {})

  newData.value.formId = form.value.id
  inspectionDetailMap.value = form.value.details.reduce((acc, cur) => {
    mbExpandButtonIcon.value[`${cur.itemId}`] = h(ArrowDownBold)
    acc[cur.itemId] = {
      status: null,
      checkValue: '',
      itemId: cur.itemId,
      remarks: '',
      files: [],
    }
    return acc
  }, {})
})
</script>

<style lang="scss" scoped></style>
