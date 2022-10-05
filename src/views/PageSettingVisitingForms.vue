<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>訪視表條文管理</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增訪視表條文
        </el-button>
      </div>
    </template>
    <AppVisitingFormListTable
      :visitingForms="visitingForms"
      :isLoading="isLoading"
      :delete="deleteVisitingForms"
      :update="showUpdateDialog"
      @update="showUpdateDialog"
    />
    <AppVisitingFormCreateDialog
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createVisitingForm"
    />
    <AppVisitingFormUpdateDialog
      v-model:show="isShowUpdateDialog"
      :data="visitingForm"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateVisingForm"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useVisitingFormStore } from '../stores/visitingForms'
import AppVisitingFormListTable from '../components/visitingForm/AppVisitingFormListTable.vue'
import AppVisitingFormCreateDialog from '../components/visitingForm/AppVisitingFormCreateDialog.vue'
import AppVisitingFormUpdateDialog from '../components/visitingForm/AppVisitingFormUpdateDialog.vue'

const visitingFormStore = useVisitingFormStore()

const { visitingForms, isLoading } = storeToRefs(visitingFormStore)
const {
  getVisitingForms,
  createVisitingForm,
  getVisitingFormById,
  updateVisingForm,
  deleteVisitingForms,
} = visitingFormStore

const visitingForm = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)

const showCreateDialog = () => (isShowCreateDialog.value = true)

const showUpdateDialog = async (id) => {
  visitingForm.value = await getVisitingFormById(id)
  isShowUpdateDialog.value = true
}
const rules = reactive({
  class: [
    { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
    { max: 50, message: '最多50個字元' },
  ],
  code: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 5, message: '最多5個字元' },
  ],
  description: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 4000, message: '最多4000個字元' },
  ],
})

getVisitingForms()
</script>

<style lang="scss" scoped></style>
