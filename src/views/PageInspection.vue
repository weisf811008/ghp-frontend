<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢紀錄</h2>
        <el-button
          size="large"
          @click="() => (showInspectFormDialog = true)"
          icon="Plus"
        >
          巡檢紀錄填報
        </el-button>
      </div>
    </template>
    <el-input v-model="search" placeholder="Search" size="large" />
    <el-table
      :data="getTableData"
      v-loading="isLoading"
      table-layout="auto"
      class="hidden-sm-and-down"
    >
      <el-table-column label="項次" fixed align="center" width="60">
        <template #default="scope">
          {{ scope.$index + (page - 1) * pageSize + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="巡檢日期" prop="date" align="center" width="100">
        <template #default="scope">
          {{ format(parseISO(scope.row.date), 'yyyy/MM/dd') }}
        </template>
      </el-table-column>
      <el-table-column label="巡檢表單名稱" prop="title" />
      <el-table-column
        label="填報時間"
        prop="createdAt"
        align="center"
        width="200"
      >
        <template #default="scope">
          {{ format(parseISO(scope.row.createdAt), 'yyyy/MM/dd HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column label="巡檢人員" align="center" width="100">
        <template #default="scope">
          {{ scope.row.inspectedBy.name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template #default="scope">
          <el-button
            type="info"
            text
            size="large"
            icon="Document"
            @click="(e) => handleOpenDrawer(e, scope.row)"
          >
            查看巡檢紀錄
          </el-button>
          <!-- <el-button
            type="warning"
            text
            size="large"
            icon="Edit"
            @click="
              () =>
                router.push({
                  name: 'InspectionCorrecting',
                  params: { id: scope.row.id },
                })
            "
          >
            複檢
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="mb hidden-md-only hidden-lg-only hidden-xl-only">
      <el-card
        class="mb-card"
        v-for="(row, index) in getTableData"
        :key="`insp-sm-${row.id}`"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label="#">
            {{ index + (page - 1) * pageSize + 1 }}
          </el-descriptions-item>
          <el-descriptions-item label="巡檢日期">
            {{ format(parseISO(row.date), 'yyyy/MM/dd') }}
          </el-descriptions-item>
          <el-descriptions-item label="巡檢表單">
            {{ row.title }}
          </el-descriptions-item>
          <el-descriptions-item label="填報時間">
            {{ format(parseISO(row.createdAt), 'yyyy/MM/dd HH:mm') }}
          </el-descriptions-item>
          <el-descriptions-item label="巡檢人員">
            {{ row.inspectedBy.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <el-button
              type="info"
              text
              bg
              size="large"
              class="mb-button"
              icon="Document"
              @click="(e) => handleOpenDrawer(e, row)"
            >
              查看巡檢紀錄
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <el-pagination
      class="pages"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="getFilteredData.length"
      @current-change="handlePageChange"
    />
  </el-card>
  <el-dialog
    v-model="showInspectFormDialog"
    title="選擇巡檢表單"
    width="100%"
    :before-close="handleCloseInspectFormDialog"
    style="max-width: 550px"
  >
    <el-form
      ref="inspectFormRef"
      :model="inspectFormData"
      :rules="rules"
      size="large"
      status-icon
      hide-required-asterisk
    >
      <el-form-item label="選擇表單" prop="formId">
        <el-select
          class="formSelect"
          size="large"
          v-model="inspectFormData.formId"
          placeholder="選擇表單"
        >
          <el-option
            v-for="form in forms"
            :value="form.id"
            :label="form.title"
            :key="`select-form-${form.id}`"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="mb-footer-button">
        <el-button
          type="danger"
          text
          size="large"
          class="cancel-button"
          @click="handleCloseInspectFormDialog"
          >取消
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="(e) => handleOpenInspectForm(e, inspectFormRef)"
          >送出
        </el-button>
      </span>
    </template>
  </el-dialog>
  <div class="hidden-sm-and-down">
    <el-drawer
      ref="showDrawerRef"
      v-model="showRecord"
      title="查看巡檢紀錄"
      size="80%"
      :before-close="handleCloseDrawer"
    >
      <el-descriptions border :column="2">
        <el-descriptions-item label="表單名稱" :span="2">
          {{ inspection.title }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢日期">
          {{
            inspection.date && format(parseISO(inspection.date), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="限期改善日期">
          {{
            inspection.dueDate &&
            format(parseISO(inspection.dueDate), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢人員">
          {{ inspection.inspectedBy.name }}
        </el-descriptions-item>
        <el-descriptions-item label="填報時間">
          {{
            inspection.createdAt &&
            format(parseISO(inspection.createdAt), 'yyyy/MM/dd HH:mm')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="備註">
          {{ inspection.remarks }}
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        :data="inspection.details"
        style="width: 100%"
        :default-expand-all="true"
      >
        <el-table-column label="項次" fixed align="center" width="60">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="檢核大項" prop="category" width="170" />
        <el-table-column label="檢核細項" prop="item" />
        <el-table-column
          label="測量值"
          prop="checkValue"
          align="center"
          width="90"
        />
        <el-table-column
          label="檢核結果"
          prop="status"
          align="center"
          width="230"
        >
          <template #default="scope">
            <span
              :class="{
                pass: scope.row.status === 'pass',
                fail: scope.row.status === 'fail',
                others: scope.row.status === 'others',
              }"
            >
              {{ statusMap[scope.row.status] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template #default="scope">
            <div>
              <el-card>
                {{ scope.row.remarks }}
              </el-card>
            </div>
            <div>
              <el-upload
                :file-list="
                  scope.row.files.map((f) => ({
                    name: f.originalname,
                    url: `/api/inspections/files/${f.filename}`,
                  }))
                "
                :on-preview="handlePictureCardPreview"
                list-type="picture-card"
                disabled
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
  <div class="hidden-md-and-up">
    <el-drawer
      ref="showDrawerRef"
      v-model="showRecord"
      title="查看巡檢紀錄"
      size="100%"
      :before-close="handleCloseDrawer"
    >
      <el-descriptions border :column="1">
        <el-descriptions-item label="表單名稱">
          {{ inspection.title }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢日期">
          {{
            inspection.date && format(parseISO(inspection.date), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="限期改善日期">
          {{
            inspection.dueDate &&
            format(parseISO(inspection.dueDate), 'yyyy/MM/dd')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="巡檢人員">
          {{ inspection.inspectedBy.name }}
        </el-descriptions-item>
        <el-descriptions-item label="填報時間">
          {{
            inspection.createdAt &&
            format(parseISO(inspection.createdAt), 'yyyy/MM/dd HH:mm')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="備註">
          {{ inspection.remarks }}
        </el-descriptions-item>
      </el-descriptions>
      <el-card
        v-for="(row, index) in inspection.details"
        :key="`insp-mb-${row.id}`"
        class="mb-card"
      >
        <el-descriptions :column="1">
          <el-descriptions-item label="#">
            {{ index + (page - 1) * pageSize + 1 }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核大項">
            {{ row.category }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核細項">
            {{ row.item }}
          </el-descriptions-item>
          <el-descriptions-item label="測量值">
            {{ row.checkValue }}
          </el-descriptions-item>
          <el-descriptions-item label="檢核結果">
            <span
              :class="{
                pass: row.status === 'pass',
                fail: row.status === 'fail',
                others: row.status === 'others',
              }"
            >
              {{ statusMap[row.status] }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item>
            <div>
              <el-card>
                {{ row.remarks }}
              </el-card>
            </div>
            <div>
              <el-upload
                :file-list="
                  row.files.map((f) => ({
                    name: f.originalname,
                    url: `/api/inspections/files/${f.filename}`,
                  }))
                "
                :on-preview="handlePictureCardPreview"
                list-type="picture-card"
                disabled
              />
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-drawer>
  </div>

  <el-dialog v-model="dialogImageVisible">
    <img
      v-if="isImage"
      :src="dialogImageUrl"
      alt="Preview Image"
      style="width: 100%"
    />
    <img
      v-else
      src="../assets/undraw_text_files_au1q.svg"
      alt="Preview Image"
      style="width: 100%"
    />
    <el-link :href="dialogImageUrl" target="_blank" type="primary">
      檔案下載
    </el-link>
  </el-dialog>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { format, parseISO } from 'date-fns'
import { useFormStore } from '../stores/form'
import { useInspectionStore } from '../stores/inspection'

const formStore = useFormStore()
const { forms } = storeToRefs(formStore)

const inspectionStore = useInspectionStore()
const { inspections, isLoading } = storeToRefs(inspectionStore)

const { getForms } = formStore
const { setCreateFormId, getInspections, getInspection, uploadFile, getFile } =
  inspectionStore

const router = useRouter()
const inspection = ref({})
const showDrawerRef = ref()
const showInspectFormDialog = ref(false)
const showRecord = ref(false)
const inspectFormRef = ref()
const inspectFormData = ref({
  formId: null,
})

const search = ref('')
const tableData = ref([])

const filterData = () =>
  (tableData.value = inspections.value.filter(
    (data) =>
      !search.value ||
      data.date.includes(search.value) ||
      data.createdAt.includes(search.value) ||
      data.title.includes(search.value)
  ))

const getFilteredData = computed(() => filterData())

const statusMap = {
  pass: '合格',
  fail: '不合格',
  others: '其他',
}

onMounted(() => {
  getForms()
  getInspections()
})

const rules = ref({
  formId: [{ required: true, message: '此欄位不得為空', trigger: 'blur' }],
})

const dialogImageUrl = ref('')
const dialogImageVisible = ref(false)
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogImageVisible.value = true
}

//pagination
const pageSize = ref(10)
const page = ref(1)
const getTableData = computed(() =>
  filterData().slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value
  )
)
const handlePageChange = (p) => {
  page.value = p
}

const handleCloseInspectFormDialog = (e) => {
  showInspectFormDialog.value = false
  inspectFormRef.value.resetFields()
  inspectFormRef.value.clearValidate()
}

const handleOpenInspectForm = (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    if (valid) {
      setCreateFormId(inspectFormData.value.formId)
      router.push({ name: 'InspectionSubmitting' })
    }
  })
}

const handleOpenDrawer = async (e, row) => {
  e.preventDefault()
  inspection.value = await getInspection(row.id)
  showRecord.value = true
}

const handleCloseDrawer = (e) => {
  showRecord.value = false
}

const imgExt = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

const isImage = computed(() =>
  imgExt.includes(dialogImageUrl.value.split('.').pop().toLowerCase())
)
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 350px;

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
}

.pass {
  color: #67c23a;
}

.fail {
  color: #f56c6c;
}

.others {
  color: #e6a23c;
}

:deep(div.el-upload.el-upload--picture-card) {
  display: none;
}

@media screen and (max-width: 991px) {
  .mb-card {
    margin: 10px 0;
  }
  .mb-button {
    width: 100%;
  }

  .mb-footer-button {
    display: flex;
    width: 100%;
    .cancel-button {
      background-color: #f0f2f5;
    }

    .el-button {
      width: 50%;
    }
  }
}
</style>
