<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核大項主檔</h2>
        <el-button size="large" @click.prevent="showCreateDialog" icon="Plus">
          新增大項
        </el-button>
      </div>
    </template>
    <AppListTable
      :categories="categories"
      :isLoading="isLoading"
      :delete="deleteCategory"
      :update="showUpdateDialog"
      @update="showUpdateDialog"
    />
    <AppCreateDialog
      v-model:show="isShowCreaetDialog"
      :isLoading="isLoading"
      :rules="rules"
      :create="createCategory"
    />
    <AppUpdateDialog
      v-model:show="isShowUpdateDialog"
      :data="category"
      :isLoading="isLoading"
      :rules="rules"
      :update="updateCategory"
    />
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '../stores/categories'
import AppListTable from '../components/category/AppListTable.vue'
import AppCreateDialog from '../components/category/AppCreateDialog.vue'
import AppUpdateDialog from '../components/category/AppUpdateDialog.vue'

const categoryStore = useCategoryStore()
const { categories, isLoading } = storeToRefs(categoryStore)
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = categoryStore

const category = ref({})
const isShowCreaetDialog = ref(false)
const isShowUpdateDialog = ref(false)
const rules = reactive({
  category: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
    { max: 255, message: '長度在255個字元內' },
  ],
})

const showCreateDialog = () => (isShowCreaetDialog.value = true)

const showUpdateDialog = async (id) => {
  category.value = await getCategoryById(id)
  isShowUpdateDialog.value = true
}

getCategories()
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }
}
</style>
