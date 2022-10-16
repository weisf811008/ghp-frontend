<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢目錄</h2>
        <el-button size="large" @click.prevent="showCreateDrawer" icon="Plus">
          新增巡檢表單
        </el-button>
      </div>
    </template>
    <AppFormListTable
      :forms="forms"
      :isLoading="isLoading"
      :delete="deleteForm"
      :update="showUpdateDrawer"
      @update="showUpdateDrawer"
    />
    <AppFormCreateDrawer
      v-model:show="isShowCreateDrawer"
      :isLoading="isLoading"
      :rules="rules"
      :create="createForm"
      :getItems="getItems"
      :getTransferList="getTransferList"
    />
    <AppFormUpdateDrawer
      v-model:show="isShowUpdateDrawer"
      :data="form"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateForm"
      :getItems="getItems"
      :getTransferList="getTransferList"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFormStore } from '../stores/form'
import { useItemStore } from '../stores/items'
import AppFormListTable from '../components/form/AppFormListTable.vue'
import AppFormCreateDrawer from '../components/form/AppFormCreateDrawer.vue'
import AppFormUpdateDrawer from '../components/form/AppFormUpdateDrawer.vue'

const formStore = useFormStore()
const { forms, isLoading } = storeToRefs(formStore)
const { getForms, getFormById, createForm, updateForm, deleteForm } = formStore

const itemStore = useItemStore()
const { getItems, getTransferList } = itemStore

const form = ref({})
const isShowCreateDrawer = ref(false)
const isShowUpdateDrawer = ref(false)

const showCreateDrawer = () => (isShowCreateDrawer.value = true)
const showUpdateDrawer = async (id) => {
  form.value = await getFormById(id)
  isShowUpdateDrawer.value = true
}

const rules = reactive({
  title: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '最多255個字元' },
  ],
  itemIds: [
    { required: true, message: '此欄位不得為空', trigger: ['blur', 'change'] },
  ],
})

onMounted(() => {
  getForms()
  getItems()
})
</script>

<style lang="scss" scoped></style>
