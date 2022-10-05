<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>GHP條文管理</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增GHP條文
        </el-button>
      </div>
    </template>
    <AppRegulationListTable
      :regulations="regulations"
      :isLoading="isLoading"
      :delete="deleteRegulation"
      :update="showUpdateDialog"
      @update="showUpdateDialog"
    />
    <AppRegulationCreateDailog
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createRegulation"
    />
    <AppRegulationUpdateDailog
      v-model:show="isShowUpdateDialog"
      :data="regulation"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateRegulation"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRegulationStore } from '../stores/regulations'
import AppRegulationListTable from '../components/regulation/AppRegulationListTable.vue'
import AppRegulationCreateDailog from '../components/regulation/AppRegulationCreateDialog.vue'
import AppRegulationUpdateDailog from '../components/regulation/AppRegulationUpdateDialog.vue'

const regulationStore = useRegulationStore()
const { regulations, isLoading } = storeToRefs(regulationStore)
const {
  getRegulations,
  createRegulation,
  getRegulationById,
  updateRegulation,
  deleteRegulation,
} = regulationStore

const regulation = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)

const showCreateDialog = () => (isShowCreateDialog.value = true)

const showUpdateDialog = async (id) => {
  regulation.value = await getRegulationById(id)
  isShowUpdateDialog.value = true
}
const rules = reactive({
  class: [{ required: true, message: '此欄位不得為空', trigger: ['change'] }],
  code: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 5, message: '最多5個字元' },
  ],
  description: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 4000, message: '最多4000個字元' },
  ],
})

getRegulations()
</script>
<style lang="scss" scoped></style>
