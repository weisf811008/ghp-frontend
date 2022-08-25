<template>
  <el-card class="box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h2>巡檢紀錄填報</h2>
      </div>
    </template>
    <el-form
      ref="submitFormRef"
      :model="createData"
      :rules="rules"
      status-icon
      hide-required-asterisk
    >
      <div class="subtitle">
        <h3>表單名稱：{{ form.title }}</h3>
        <el-form-item label="巡檢日期" prop="date">
          <el-date-picker
            v-model="createData.date"
            type="date"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
          />
        </el-form-item>
      </div>
      <el-card
        class="box-card"
        v-for="category in Object.keys(formDetailMap)"
        :key="category"
      >
        <template #header>
          <div class="card-header">
            <span>{{ category }}</span>
            <el-button icon="Select" @click="inspectInBatch(category)">
              一鍵檢核
            </el-button>
          </div>
        </template>
        <el-table
          :data="formDetailMap[category]"
          :row-class-name="setExpandRow"
          style="width: 100%"
        >
          <el-table-column label="項次" fixed align="center" width="60">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="檢核細項" prop="item" />
          <el-table-column
            label="測量值"
            prop="checkValue"
            align="center"
            width="100"
          >
            <template #default="scope">
              <el-input
                v-model="inspectionDetailMap[scope.row.id].checkValue"
                v-if="scope.row.needToComment"
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
                :error="uncheckedItems.includes(scope.row.id) ? '必填' : null"
                @change="() => handleDetailChange(scope.row.id)"
              >
                <el-radio-group
                  v-model="inspectionDetailMap[scope.row.id].status"
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
            </template>
          </el-table-column>
          <el-table-column type="expand">
            <template #default="scope">
              <div>
                <el-input
                  v-model="inspectionDetailMap[scope.row.id].remarks"
                  prop="remarks"
                  :rows="3"
                  type="textarea"
                  :key="`remarks-${scope.row.id}`"
                  placeholder="請填寫備註"
                />
              </div>
              <div>
                <el-upload
                  :file-list="
                    inspectionDetailMap[scope.row.id].photos.map((p) => ({
                      name: p.originalname,
                      url: `/api/inspections/photos/${p.filename}`,
                    }))
                  "
                  :on-success="(res) => handleUploaded(scope.row, res)"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="
                    (file, files) => handleRemove(scope.row, file, files)
                  "
                  action="/api/inspections/upload"
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
          <el-form-item label="限期改善" prop="dueDate">
            <el-date-picker
              v-model="createData.dueDate"
              type="date"
              value-format="YYYY-MM-DD"
              :disabled-date="disabledDueDate"
              :shortcuts="shortcuts"
              size="large"
            />
          </el-form-item>
          <el-button type="danger" text @click="handleCloseInspectForm">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="(e) => handleSubmitInspectForm(e, submitFormRef)"
          >
            送出
          </el-button>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { storeToRefs } from 'pinia'
import { addDays, format } from 'date-fns'
import { useItemStore } from '../stores/items'
import { useFormStore } from '../stores/form'
import { useInspectionStore } from '../stores/inspection'

const itemStore = useItemStore()
const { getNeedToComment } = itemStore

const formStore = useFormStore()
const { getFormById } = formStore

const inspectionStore = useInspectionStore()
const { createFormId } = storeToRefs(inspectionStore)
const { createInspection } = inspectionStore

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
  dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  checkValue: '',
  remarks: '',
  formId: null,
  details: [],
})

const shortcuts = [
  {
    text: '今日',
    value: new Date(),
  },
  {
    text: '昨日',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '上週',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const disabledDueDate = (time) => {
  return time.getTime() < Date.now()
}

const inspectInBatch = (category) => {
  formDetailMap.value[category].forEach((row) => {
    if (!inspectionDetailMap.value[row.id].status) {
      inspectionDetailMap.value[row.id].status = 'pass'
    }
  })
}

const handleDetailChange = (id) => {
  uncheckedItems.value = uncheckedItems.value.filter((a) => a !== id)
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
    acc[cur.id] = {
      status: null,
      checkValue: '',
      formDetailId: cur.id,
      remarks: '',
      photos: [],
    }
    return acc
  }, {})
})

const setExpandRow = ({ row, rowIndex }) => {
  const detail = inspectionDetailMap.value[row.id]
  const item = form.value.details.find((d) => d.id === row.id)
  return detail.status === 'pass' && !item.needToComment ? 'no-expand' : null
}

const handleRemove = (row, uploadFile, uploadFiles) => {
  inspectionDetailMap.value[row.id].photos = inspectionDetailMap.value[
    row.id
  ].photos.filter((p) => p.filename !== uploadFile.url.split('/').pop())
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogImageVisible.value = true
}

const handleUploaded = (row, res) => {
  inspectionDetailMap.value[row.id].photos.push(res)
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
      .map((d) => d.formDetailId)
    if (valid && uncheckedItems.value.length === 0) {
      try {
        await createInspection(createData.value)
        router.push({ name: 'Inspection' })
      } catch (e) {
        console.error(e)
        ElNotification({
          title: 'Error',
          message: '新增巡檢紀錄失敗',
          type: 'error',
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.box-card {
  min-width: 480px;
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

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
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
</style>
