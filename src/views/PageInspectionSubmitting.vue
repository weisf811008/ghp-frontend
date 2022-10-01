<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢紀錄填報</h2>
      </div>
    </template>
    <el-form ref="submitFormRef" :model="createData" :rules="rules" status-icon>
      <div class="subtitle">
        <h3>{{ form.title }}</h3>
        <el-form-item label="巡檢日期" prop="date">
          <el-date-picker
            v-model="createData.date"
            type="date"
            size="large"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </div>
      <el-card
        v-for="category in Object.keys(formDetailMap)"
        :key="category"
        class="mb-card-table"
      >
        <template #header>
          <div class="inspect-header">
            <div
              class="category-name"
              style="font-size: var(--el-font-size-large)"
            >
              {{ category }}
            </div>
            <div>
              <el-button
                class="check-all"
                icon="Select"
                size="large"
                @click="inspectInBatch(category)"
              >
                一鍵檢核
              </el-button>
            </div>
          </div>
        </template>
        <el-table
          :data="formDetailMap[category]"
          :row-class-name="setExpandRow"
          class="tableRow hidden-sm-and-down"
        >
          <el-table-column label="項次" align="center" width="60">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="檢核細項" prop="item" class="check-item" />
          <el-table-column
            label="測量值"
            prop="checkValue"
            align="center"
            width="100"
          >
            <template #default="scope">
              <el-input
                v-model="inspectionDetailMap[scope.row.itemId].checkValue"
                v-if="scope.row.needCheckValue"
                class="check-value"
                placeholder="測量值"
                size="large"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="檢核結果"
            prop="status"
            align="center"
            width="230"
          >
            <template #default="scope">
              <el-form-item
                :error="
                  uncheckedItems.includes(scope.row.itemId) ? '必填' : null
                "
                @change="() => handleDetailChange(scope.row.itemId)"
              >
                <el-radio-group
                  v-model="inspectionDetailMap[scope.row.itemId].status"
                >
                  <el-radio-button
                    label="pass"
                    value="pass"
                    class="inspect-status"
                    data-ghp-inspection-type="pass"
                  >
                    合格
                  </el-radio-button>
                  <el-radio-button
                    label="fail"
                    value="fail"
                    class="inspect-status"
                    data-ghp-inspection-type="fail"
                  >
                    不合格
                  </el-radio-button>
                  <el-radio-button
                    label="others"
                    value="others"
                    class="inspect-status"
                    data-ghp-inspection-type="others"
                  >
                    其他
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template #default="scope">
              <div>
                <el-input
                  v-model="inspectionDetailMap[scope.row.itemId].remarks"
                  prop="remarks"
                  :rows="3"
                  type="textarea"
                  :key="`remarks-${scope.row.itemId}`"
                  placeholder="請填寫備註"
                />
              </div>
              <div>
                <el-upload
                  :file-list="
                    inspectionDetailMap[scope.row.itemId].files.map((f) => ({
                      name: f.originalname,
                      url: `/api/inspections/files/${f.filename}`,
                    }))
                  "
                  :on-success="(res) => handleUploaded(scope.row, res)"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="
                    (file, files) => handleRemove(scope.row, file, files)
                  "
                  action="/api/inspections/files"
                  list-type="picture-card"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :ref="(el) => setMbTableRef(category, el)"
          :data="formDetailMap[category]"
          @expand-change="handleMbExpandChange"
          class="hidden-md-and-up"
          row-class-name="no-expand"
        >
          <el-table-column class="check-item">
            <template #default="scope">
              <p style="font-size: var(--el-font-size-large)">
                {{ scope.$index + 1 }}. {{ scope.row.item }}
              </p>
              <el-input
                v-model="inspectionDetailMap[scope.row.itemId].checkValue"
                v-if="scope.row.needCheckValue"
                class="check-value"
                placeholder="測量值"
                size="large"
              />
              <el-form-item
                :error="
                  uncheckedItems.includes(scope.row.itemId) ? '必填' : null
                "
                @change="() => handleDetailChange(scope.row.itemId)"
              >
                <el-radio-group
                  v-model="inspectionDetailMap[scope.row.itemId].status"
                  size="large"
                >
                  <el-radio-button
                    label="pass"
                    value="pass"
                    data-ghp-inspection-type="pass"
                  >
                    合格
                  </el-radio-button>
                  <el-radio-button
                    label="fail"
                    value="fail"
                    data-ghp-inspection-type="fail"
                  >
                    不合格
                  </el-radio-button>
                  <el-radio-button
                    label="others"
                    value="others"
                    data-ghp-inspection-type="others"
                  >
                    其他
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div>
                <el-button
                  size="large"
                  :icon="mbExpandButtonIcon[`${scope.row.itemId}`]"
                  @click.prevent="() => expandMbRow(category, scope.row)"
                >
                  備註及附檔
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="1">
            <template #default="scope">
              <div>
                <el-input
                  v-model="inspectionDetailMap[scope.row.itemId].remarks"
                  prop="remarks"
                  :rows="3"
                  type="textarea"
                  :key="`remarks-${scope.row.itemId}`"
                  placeholder="請填寫備註"
                />
              </div>
              <div>
                <el-upload
                  :file-list="
                    inspectionDetailMap[scope.row.itemId].files.map((f) => ({
                      name: f.originalname,
                      url: `/api/inspections/files/${f.filename}`,
                    }))
                  "
                  :on-success="(res) => handleUploaded(scope.row, res)"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="
                    (file, files) => handleRemove(scope.row, file, files)
                  "
                  action="/api/inspections/files"
                  list-type="picture-card"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div>
        <el-input
          v-model="createData.remarks"
          rows="2"
          type="textarea"
          placeholder="請輸入備註"
        />
        <div class="footer">
          <div class="due-date">
            <el-form-item label="限期改善" prop="dueDate">
              <el-date-picker
                v-model="createData.dueDate"
                type="date"
                size="large"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDueDate"
              />
            </el-form-item>
          </div>
          <div class="footer-button">
            <el-button
              type="danger"
              size="large"
              text
              class="cancel-button"
              @click="handleCloseInspectForm"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="large"
              @click="(e) => handleSubmitInspectForm(e, submitFormRef)"
            >
              送出
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </el-card>
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
  </el-dialog>
</template>
<script setup>
import axios from 'axios'
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'
import { useItemStore } from '../stores/items'
import { useFormStore } from '../stores/form'
import { useInspectionStore } from '../stores/inspection'
import { ArrowUpBold, ArrowDownBold } from '@element-plus/icons-vue'

const itemStore = useItemStore()
const { getNeedToComment } = itemStore

const formStore = useFormStore()
const { getFormById } = formStore

const inspectionStore = useInspectionStore()
const { createFormId } = storeToRefs(inspectionStore)
const { createInspection } = inspectionStore

const mbTableRef = ref({})
const mbExpandButtonIcon = ref({})

const submitFormRef = ref()

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

const formDetailMap = ref({})
const inspectionDetailMap = ref({})
const uncheckedItems = ref([])

const router = useRouter()
const search = ref('')

const showInput = ref(false)
const createCheckValue = ref('')
const dialogImageUrl = ref('')
const dialogImageVisible = ref(false)

const createData = ref({
  date: format(new Date(), 'yyyy-MM-dd'),
  dueDate: '',
  checkValue: '',
  remarks: '',
  formId: null,
  details: [],
})

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const disabledDueDate = (time) => {
  return time.getTime() < Date.now()
}

const inspectInBatch = (category) => {
  formDetailMap.value[category].forEach((row) => {
    if (!inspectionDetailMap.value[row.itemId].status) {
      inspectionDetailMap.value[row.itemId].status = 'pass'
    }
  })
}

const handleDetailChange = (itemId) => {
  uncheckedItems.value = uncheckedItems.value.filter((a) => a !== itemId)
}

const setMbTableRef = (category, el) => {
  mbTableRef.value[category] = el
}

const expandMbRow = (category, row) => {
  mbTableRef.value[category].toggleRowExpansion(row)
}

onMounted(async () => {
  if (!createFormId.value) {
    return router.push({ name: 'Inspection' })
  }
  form.value = await getFormById(createFormId.value)

  formDetailMap.value = form.value.details.reduce((acc, cur) => {
    if (!acc[cur.category]) {
      acc[cur.category] = []
    }
    acc[cur.category].push(cur)
    return acc
  }, {})

  createData.value.formId = form.value.id
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

const setExpandRow = ({ row, rowIndex }) => {
  const detail = inspectionDetailMap.value[row.itemId]
  const item = form.value.details.find((d) => d.itemId === row.itemId)
  return detail.status === 'pass' && !item.needCheckValue ? 'no-expand' : null
}

const handleMbExpandChange = (row, expandedRows) => {
  const isExpanded = expandedRows.some((r) => r.itemId === row.itemId)
  mbExpandButtonIcon.value[`${row.itemId}`] = isExpanded
    ? h(ArrowUpBold)
    : h(ArrowDownBold)
}

const handleRemove = (row, uploadFile, uploadFiles) => {
  inspectionDetailMap.value[row.itemId].files = inspectionDetailMap.value[
    row.itemId
  ].files.filter((p) => p.filename !== uploadFile.url.split('/').pop())
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogImageVisible.value = true
}

const handleUploaded = (row, res) => {
  inspectionDetailMap.value[row.itemId].files.push(res)
}

const imgExt = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg']

const isImage = computed(() =>
  imgExt.includes(dialogImageUrl.value.split('.').pop().toLowerCase())
)

const handleCloseInspectForm = () => {
  router.push({ name: 'Inspection' })
}

const handleSubmitInspectForm = async (e, formRef) => {
  e.preventDefault()
  formRef.validate(async (valid, fields) => {
    createData.value.details = Object.values(inspectionDetailMap.value)
    uncheckedItems.value = createData.value.details
      .filter((d) => !d.status)
      .map((d) => d.itemId)
    if (valid && uncheckedItems.value.length === 0) {
      try {
        await createInspection({
          ...createData.value,
          date: new Date(createData.value.date).toISOString(),
          dueDate:
            createData.value.dueDate &&
            new Date(createData.value.dueDate).toISOString(),
        })
        router.push({ name: 'Inspection' })
      } catch (e) {
        console.error(e)
        const msg =
          axios.isAxiosError(e) && e.response.status === 422
            ? e.response.data.errors
                .map((err) => `${err.param}${err.msg}`)
                .join('、')
            : '發生錯誤'
        ElNotification({
          type: 'error',
          title: '新增巡檢紀錄失敗',
          message: msg,
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 350px;
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }
  }

  .subtitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .inspect-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tableRow {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .mb-card-table {
    margin-bottom: 6px;
  }

  .el-button {
    width: 100%;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    text-align: center;
    margin-top: 20px;

    .footer-button {
      margin-top: -20px;
    }
  }
}

:deep(tr.no-expand > td.el-table__expand-column > div.cell) {
  display: none;
}

:deep(.el-radio-button__inner:hover) {
  color: var(--el-text-color-regular);
}

:deep(.el-radio-button.is-active .el-radio-button__inner) {
  color: white;
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='pass']
    .el-radio-button__inner) {
  background: var(--el-color-success);
  border: 1px solid var(--el-color-success);
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='fail']
    .el-radio-button__inner) {
  background: var(--el-color-danger);
  border: 1px solid var(--el-color-danger);
}

:deep(.el-radio-button.is-active[data-ghp-inspection-type='others']
    .el-radio-button__inner) {
  background: var(--el-color-warning);
  border: 1px solid var(--el-color-warning);
}

:deep(.el-form-item.is-success.is-no-asterisk.el-form-item--feedback) {
  margin: 0;
}

@media screen and (max-width: 991px) {
  .box-card {
    .subtitle {
      display: block;
      margin: 0 auto 10px auto;

      h3 {
        margin: 0 auto 10px 0;
      }
    }

    .inspect-header {
      display: block;

      .category-name {
        margin-bottom: 10px;
        text-align: center;
      }
      .check-all {
        width: 100%;
      }
    }

    .check-item {
      .check-value {
        margin: 5px 0;
      }
    }

    .el-radio-group {
      width: 100%;
      .el-radio-button {
        width: 100%;
        border: 0.1px solid rgb(220, 223, 230);
        border-radius: 4px;
        margin-top: 5px;
        :deep(.el-radio-button__inner) {
          width: 100%;
        }
      }
    }

    .footer {
      justify-content: start;
    }

    .due-date {
      margin-bottom: 20px;
    }

    .footer-button {
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
}
</style>
