<template>
  <div>
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h2>巡檢紀錄</h2>
          <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
            巡檢紀錄填報
          </el-button>
        </div>
      </template>
      <div>
        <el-input v-model="search" placeholder="Search" size="large" />
      </div>
      <AppInspectionListTable
        :tableData="tableData"
        :isLoading="isLoading"
        :page="page"
        :pageSize="pageSize"
        @update="showCheckDrawer"
      />
      <AppInspectionListCard
        :tableData="tableData"
        :isLoading="isLoading"
        :page="page"
        :pageSize="pageSize"
        @update="showCheckDrawer"
      />
      <AppPagination
        v-model:page="page"
        v-model:pageSize="pageSize"
        :data="filterData"
        @pageChange="handlePageChange"
      />
    </el-card>
    <AppInspectionSelectDialog
      v-model:show="isShowCreateDialog"
      :forms="forms"
      :isLoading="isLoading"
      :rules="rules"
    />
    <AppInspectionDrawer
      v-model:show="isShowCheckDrawer"
      :isLoading="isLoading"
      :inspection="inspection"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFormStore } from '../stores/form'
import { useInspectionStore } from '../stores/inspection'

const formStore = useFormStore()
const { forms } = storeToRefs(formStore)

const inspectionStore = useInspectionStore()
const { inspections, isLoading } = storeToRefs(inspectionStore)

const { getForms } = formStore
const { setCreateFormId, getInspections, getInspection, uploadFile, getFile } =
  inspectionStore

const inspection = ref({})
const isShowCreateDialog = ref(false)
const isShowCheckDrawer = ref(false)

const showCreateDialog = () => {
  isShowCreateDialog.value = true
}

const showCheckDrawer = async (id) => {
  inspection.value = await getInspection(id)
  isShowCheckDrawer.value = true
}

const rules = ref({
  formId: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
})

//search
const search = ref('')
const filterData = computed(
  () =>
    (tableData.value = inspections.value.filter(
      (data) =>
        !search.value ||
        data.date.includes(search.value) ||
        data.createdAt.includes(search.value) ||
        data.title.includes(search.value)
    ))
)

//pagination
const page = ref(1)
const pageSize = ref(20)
const tableData = ref([])

const handlePageChange = (data) => {
  tableData.value = data
}

onMounted(() => {
  getForms()
  getInspections()
})
</script>

<style lang="scss" scoped></style>
