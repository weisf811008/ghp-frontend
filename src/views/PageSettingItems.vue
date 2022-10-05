<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核細項主檔</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增細項
        </el-button>
      </div>
    </template>
    <AppItemListTable
      :items="items"
      :isLoading="isLoading"
      :delete="deleteItem"
      :update="showUpdateDialog"
      @update="showUpdateDialog"
    />
    <AppItemCreateDialog
      v-model:show="isShowCreateDialog"
      :isLoading="isLoading"
      :rules="rules"
      :categories="categories"
      :periods="periods"
      :areas="areas"
      :regulations="regulations"
      :visitingForms="visitingForms"
      :create="createItem"
    />
    <AppItemUpdateDialog
      v-model:show="isShowUpdateDialog"
      :data="item"
      :isLoading="isLoading"
      :rules="rules"
      :categories="categories"
      :periods="periods"
      :areas="areas"
      :regulations="regulations"
      :visitingForms="visitingForms"
      :update="updateItem"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useItemStore } from '../stores/items'
import { useCategoryStore } from '../stores/categories'
import { useRegulationStore } from '../stores/regulations'
import { usePeriodStore } from '../stores/periods'
import { useAreaStore } from '../stores/areas'
import { useVisitingFormStore } from '../stores/visitingForms'
import AppItemListTable from '../components/item/AppItemListTable.vue'
import AppItemCreateDialog from '../components/item/AppItemCreateDialog.vue'
import AppItemUpdateDialog from '../components/item/AppItemUpdateDialog.vue'

const itemStore = useItemStore()
const { items, isLoading } = storeToRefs(itemStore)
const { getItems, getItemById, createItem, updateItem, deleteItem } = itemStore

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const { getCategories } = categoryStore

const regulationStore = useRegulationStore()
const { regulations } = storeToRefs(regulationStore)
const { getRegulations } = regulationStore

const periodStore = usePeriodStore()
const { getPeriods } = periodStore

const areaStore = useAreaStore()
const { getAreas } = areaStore

const visitingFormStore = useVisitingFormStore()
const { visitingForms } = storeToRefs(visitingFormStore)
const { getVisitingForms } = visitingFormStore

const periods = ref([])
const areas = ref([])

const item = ref({})
const isShowCreateDialog = ref(false)
const isShowUpdateDialog = ref(false)

const showCreateDialog = () => (isShowCreateDialog.value = true)

const showUpdateDialog = async (id) => {
  item.value = await getItemById(id)
  isShowUpdateDialog.value = true
}

const rules = reactive({
  categoryId: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
  no: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 10, message: '最多10個字元' },
  ],
  item: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 4000, message: '最多4000個字元' },
  ],
})

onMounted(async () => {
  getItems()
  getCategories()
  periods.value = await getPeriods()
  areas.value = await getAreas()
  getRegulations()
  getVisitingForms()
})
</script>

<style lang="scss" scoped></style>
