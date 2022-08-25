<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>檢核細項主檔</h2>
        <el-button @click="() => (showCreateDialog = true)" icon="Plus">
          新增細項
        </el-button>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" />
    <el-table :data="getTableData" table-layout="auto">
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="檢核大項"
        prop="category"
        fixed
        align="center"
        width="180"
      />
      <el-table-column label="編號" prop="no" fixed align="center" width="90" />
      <el-table-column label="檢核細項" prop="item" />
      <el-table-column label="週期" prop="period" align="center" width="90" />
      <el-table-column label="區域" prop="area" align="center" width="90" />
      <el-table-column
        label="條文"
        prop="regulations"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.regulations.join(',') }}
        </template>
      </el-table-column>
      <el-table-column
        label="需填資料"
        prop="needToComment"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.needToComment ? '需要' : '不需要' }}
        </template>
      </el-table-column>
      <el-table-column
        label="每日衛生管理日誌"
        prop="needJournal"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.needJournal ? '列入' : '不列入' }}
        </template>
      </el-table-column>
      <el-table-column
        label="訪視表"
        prop="needVisitingForm"
        align="center"
        width="90"
      >
        <template #default="scope">
          {{ scope.row.needVisitingForm ? '列入' : '不列入' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            text
            icon="EditPen"
            @click="handleShowUpdateDialog(scope.row)"
          >
            編輯
          </el-button>
          <el-button
            type="danger"
            text
            icon="Delete"
            @click="handleDeleteItem(scope.row)"
            width="80px"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="getFilteredData.length"
      @current-change="handlePageChange"
    />
  </el-card>
  <el-dialog
    ref="createDialogRef"
    v-model="showCreateDialog"
    title="新增細項"
    :before-close="handleCloseCreateDialog"
  >
    <el-form
      ref="createFormRef"
      :model="createData"
      :rules="rules"
      label-width="auto"
      :label-position="labelPosition"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="檢核大項" prop="categoryId">
        <el-select
          class="formSelect"
          v-model="createData.categoryId"
          placeholder="選擇大項"
        >
          <el-option
            v-for="category in categories"
            :value="category.id"
            :label="category.category"
            :key="`select-category-${category.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="編號" prop="no">
        <el-input v-model="createData.no" placeholder="請輸入編號" />
      </el-form-item>
      <el-form-item label="檢核細項" prop="item">
        <el-input
          v-model="createData.item"
          rows="2"
          type="textarea"
          placeholder="請輸入檢核細項"
        />
      </el-form-item>
      <el-form-item label="週期" prop="period">
        <el-select
          class="formSelect"
          v-model="createData.period"
          placeholder="選擇週期"
        >
          <el-option
            v-for="period in period"
            :value="period"
            :label="period"
            :key="`select-period-${period}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="區域" prop="area">
        <el-select
          class="formSelect"
          v-model="createData.area"
          placeholder="請選擇或輸入區域"
        >
          <el-option
            v-for="area in area"
            :value="area"
            :label="area"
            :key="`select-area-${area}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="條文" prop="regulations">
        <el-select
          class="formSelect"
          v-model="createData.regulations"
          multiple
          placeholder="請選擇條文"
        >
          <el-option
            v-for="regulation in regulations"
            :value="regulation.code"
            :label="regulation.code"
            :key="`select-regulation-${regulation.code}`"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="需填資料" prop="needToComment">
        <el-radio-group v-model="createData.needToComment">
          <el-radio :label="true">需要</el-radio>
          <el-radio :label="false">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每日衛生管理日誌" prop="needJournal">
        <el-radio-group v-model="createData.needJournal">
          <el-radio :label="true">列入</el-radio>
          <el-radio :label="false">不列入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="訪視表" prop="needVisitingForm">
        <el-radio-group v-model="createData.needVisitingForm">
          <el-radio :label="true">列入</el-radio>
          <el-radio :label="false">不列入</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseCreateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleCreateItem(e, createFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    ref="updateDialogRef"
    v-model="showUpdateDialog"
    title="修改細項"
    :before-close="handleCloseUpdateDialog"
  >
    <el-form
      ref="updateFormRef"
      :model="updateData"
      :rules="rules"
      label-width="auto"
      :label-position="labelPosition"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="檢核大項" prop="categoryId">
        <el-select
          class="formSelect"
          v-model="updateData.categoryId"
          placeholder="選擇大項"
        >
          <el-option
            v-for="category in categories"
            :value="category.id"
            :label="category.category"
            :key="`select-category-${category.id}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="編號" prop="no">
        <el-input v-model="updateData.no" placeholder="請輸入編號" />
      </el-form-item>
      <el-form-item label="檢核細項" prop="item">
        <el-input
          v-model="updateData.item"
          rows="2"
          type="textarea"
          placeholder="請輸入檢核細項"
        />
      </el-form-item>
      <el-form-item label="週期" prop="period">
        <el-select
          class="formSelect"
          v-model="updateData.period"
          placeholder="請選擇或輸入週期"
        >
          <el-option
            v-for="period in period"
            :value="period"
            :label="period"
            :key="`update-select-period-${period}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="區域" prop="area">
        <el-select
          class="formSelect"
          v-model="updateData.area"
          placeholder="請選擇或輸入區域"
        >
          <el-option
            v-for="area in area"
            :value="area"
            :label="area"
            :key="`update-select-area-${area}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="條文" prop="regulations">
        <el-select
          class="formSelect"
          v-model="updateData.regulations"
          multiple
          placeholder="請選擇條文"
        >
          <el-option
            v-for="regulation in regulations"
            :value="regulation.code"
            :label="regulation.code"
            :key="`update-select-regulation-${regulation.code}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需填資料" prop="needToComment">
        <el-radio-group v-model="updateData.needToComment">
          <el-radio :label="true">需要</el-radio>
          <el-radio :label="false">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="每日衛生管理日誌" prop="needJournal">
        <el-radio-group v-model="updateData.needJournal">
          <el-radio :label="true">列入</el-radio>
          <el-radio :label="false">不列入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="訪視表" prop="needVisitingForm">
        <el-radio-group v-model="updateData.needVisitingForm">
          <el-radio :label="true">列入</el-radio>
          <el-radio :label="false">不列入</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" text @click="handleCloseUpdateDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          @click="(e) => handleUpdateItem(e, updateFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useItemStore } from '../stores/items'
import { useCategoryStore } from '../stores/categories'
import { useRegulationStore } from '../stores/regulations'
import { usePeriodStore } from '../stores/periods'
import { useAreaStore } from '../stores/areas'

const itemStore = useItemStore()
const { items } = storeToRefs(itemStore)
const { getItems, createItem, updateItem, deleteItem } = itemStore

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)
const { getCategories } = categoryStore

const periodStore = usePeriodStore()
const { getPeriods } = periodStore

const areaStore = useAreaStore()
const { getAreas } = areaStore

const regulationStore = useRegulationStore()
const { regulations } = storeToRefs(regulationStore)
const { getRegulations } = regulationStore

const search = ref('')
const size = ref('default')
const labelPosition = ref('right')

const period = ref([])
const area = ref([])

const showCreateDialog = ref(false)
const showUpdateDialog = ref(false)
const createDialogRef = ref()
const updateDialogRef = ref()
const createFormRef = ref()
const updateFormRef = ref()
const createData = ref({
  categoryId: null,
  no: '',
  item: '',
  period: '',
  area: '',
  regulations: [],
  needToComment: true,
  needJournal: true,
  needVisitingForm: true,
})

const updateData = ref({
  id: null,
  categoryId: null,
  no: '',
  item: '',
  period: '',
  area: '',
  regulations: [],
  needToComment: true,
  needJournal: true,
  needVisitingForm: true,
})

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
  needToComment: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
  ],
  needJournal: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
  needVisitingForm: [
    { required: true, message: '此欄位不得為空', trigger: 'blur' },
  ],
})

const pageSize = ref(10)
const page = ref(1)
const tableData = ref([])

const filterData = () =>
  (tableData.value = items.value.filter(
    (data) =>
      !search.value ||
      data.category.includes(search.value) ||
      data.no.includes(search.value) ||
      data.item.includes(search.value) ||
      data.period.includes(search.value) ||
      data.area.includes(search.value) ||
      data.regulations.some((r) => r.includes(search.value))
  ))
const getFilteredData = computed(() => filterData())

const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)

onMounted(async () => {
  getItems()
  getCategories()
  period.value = await getPeriods()
  area.value = await getAreas()
  getRegulations()
})

const handleShowUpdateDialog = (row) => {
  updateData.value.id = row.id
  updateData.value.categoryId = row.categoryId
  updateData.value.no = row.no
  updateData.value.item = row.item
  updateData.value.period = row.period
  updateData.value.area = row.area
  updateData.value.regulations = row.regulations
  updateData.value.needToComment = row.needToComment
  updateData.value.needJournal = row.needJournal
  updateData.value.needVisitingForm = row.needVisitingForm
  showUpdateDialog.value = true
}

const handleCloseCreateDialog = () => {
  showCreateDialog.value = false
  createFormRef.value.resetFields()
  createFormRef.value.clearValidate()
  createData.value = {
    needToComment: true,
    needJournal: true,
    needVisitingForm: true,
  }
}

const handleCloseUpdateDialog = () => {
  showUpdateDialog.value = false
  updateFormRef.value.resetFields()
  updateFormRef.value.clearValidate()
}

const handleCreateItem = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          categoryId: createData.value.categoryId,
          no: createData.value.no,
          item: createData.value.item,
          period: createData.value.period,
          area: createData.value.area,
          regulations: createData.value.regulations,
          needToComment: createData.value.needToComment,
          needJournal: createData.value.needJournal,
          needVisitingForm: createData.value.needVisitingForm,
        }
        await createItem(data)
        handleCloseCreateDialog()
        ElMessage({
          type: 'success',
          message: '新增成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          title: 'Error',
          message: '新增失敗',
          type: 'error',
        })
      }
    }
  })
}

const handleUpdateItem = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = {
          categoryId: updateData.value.categoryId,
          no: updateData.value.no,
          item: updateData.value.item,
          period: updateData.value.period,
          area: updateData.value.area,
          regulations: updateData.value.regulations,
          needToComment: updateData.value.needToComment,
          needJournal: updateData.value.needJournal,
          needVisitingForm: updateData.value.needVisitingForm,
        }
        await updateItem(updateData.value.id, data)
        handleCloseUpdateDialog()
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
      } catch (e) {
        console.error(e)
        ElNotification({
          title: 'Error',
          message: '修改失敗',
          type: 'error',
        })
      }
    }
  })
}

const handleDeleteItem = (row) => {
  ElMessageBox.confirm(`是否確定要刪除${row.no}`, '', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteItem(row.id)
        ElMessage({
          type: 'success',
          message: '刪除成功',
        })
      } catch (e) {
        console.error(e)
        ElMessage({
          type: 'error',
          message: '刪除失敗',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消刪除',
      })
    })
}

const handlePageChange = (p) => {
  page.value = p
}
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

  .pages {
    justify-content: flex-end;
  }
  .dialog-footer {
    button:first-child {
      margin-right: 10px;
    }
  }
}

.formSelect {
  width: 100vw;
}
</style>
