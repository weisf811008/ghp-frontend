<template>
  <div>
    <el-form
      ref="submitFormRef"
      :model="newData"
      v-loading="isLoading"
      :rules="rules"
      status-icon
    >
      <div class="subtitle">
        <h3>{{ form.title }}</h3>
        <el-form-item label="巡檢日期" prop="date">
          <el-date-picker
            v-model="newData.date"
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
                @click.prevent="inspectInBatch(category)"
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
                <AppPhotoWall
                  :data="inspectionDetailMap[scope.row.itemId].files"
                  :uploadable="true"
                  @preview="handleFilePreview"
                  @success="(res) => handleUploaded(scope.row, res)"
                  @remove="
                    (file, files) => handleRemove(scope.row, file, files)
                  "
                />
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
              <div class="remarks-button">
                <el-button
                  size="large"
                  class="remarks-button"
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
                <AppPhotoWall
                  :data="inspectionDetailMap[scope.row.itemId].files"
                  :uploadable="true"
                  @preview="handleFilePreview"
                  @success="(res) => handleUploaded(scope.row, res)"
                  @remove="
                    (file, files) => handleRemove(scope.row, file, files)
                  "
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div>
        <el-input
          v-model="newData.remarks"
          rows="2"
          type="textarea"
          placeholder="請輸入備註"
        />
        <div class="footer">
          <div class="due-date">
            <el-form-item label="限期改善" prop="dueDate">
              <el-date-picker
                v-model="newData.dueDate"
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
              @click.prevent="closeInspectForm"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              size="large"
              class="submit-button"
              @click.prevent="() => handleSubmitInspectForm(submitFormRef)"
            >
              送出
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
    <AppPreviewDialog
      v-model:show="isShowPreview"
      :uploadFile="previewUploadFile"
    />
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    required: true,
  },
  newData: {
    type: Object,
    required: true,
  },
  create: {
    type: Function,
  },
  formDetailMap: {
    type: Object,
    default: () => ({}),
  },
  inspectionDetailMap: {
    type: Object,
    default: () => ({}),
  },
  mbExpandButtonIcon: {
    type: Object,
    default: () => ({}),
  },
  handleMbExpandChange: {
    type: Function,
  },
})

const router = useRouter()
const submitFormRef = ref()

const inspectInBatch = (category) => {
  props.formDetailMap[category].forEach((row) => {
    if (!props.inspectionDetailMap[row.itemId].status) {
      props.inspectionDetailMap[row.itemId].status = 'pass'
    }
  })
}

const closeInspectForm = () => {
  router.push({ name: 'Inspection' })
}

const handleDetailChange = (itemId) => {
  uncheckedItems.value = uncheckedItems.value.filter((a) => a !== itemId)
}

const handleSubmitInspectForm = async (formRef) => {
  formRef.validate(async (valid, fields) => {
    props.newData.details = Object.values(props.inspectionDetailMap)
    uncheckedItems.value = props.newData.details
      .filter((d) => !d.status)
      .map((d) => d.itemId)
    if (valid && uncheckedItems.value.length === 0) {
      try {
        await props.create({
          ...props.newData,
          date: new Date(props.newData.date).toISOString(),
          dueDate:
            props.newData.dueDate &&
            new Date(props.newData.dueDate).toISOString(),
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
const uncheckedItems = ref([])

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const disabledDueDate = (time) => {
  return time.getTime() < Date.now()
}

const mbTableRef = ref({})
const expandMbRow = (category, row) => {
  mbTableRef.value[category].toggleRowExpansion(row)
}

const setMbTableRef = (category, el) => {
  mbTableRef.value[category] = el
}

const setExpandRow = ({ row, rowIndex }) => {
  const detail = props.inspectionDetailMap[row.itemId]
  const item = props.form.details.find((d) => d.itemId === row.itemId)
  return detail.status === 'pass' && !item.needCheckValue ? 'no-expand' : null
}

const handleRemove = (row, uploadFile, uploadFiles) => {
  props.inspectionDetailMap[row.itemId].files = props.inspectionDetailMap[
    row.itemId
  ].files.filter((p) => p.filename !== uploadFile.url.split('/').pop())
}

const handleUploaded = (row, res) => {
  props.inspectionDetailMap[row.itemId].files.push(res)
}

const previewUploadFile = ref({})
const isShowPreview = ref(false)

const handleFilePreview = (uploadFile) => {
  previewUploadFile.value = uploadFile
  isShowPreview.value = true
}
</script>

<style lang="scss" scoped>
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

.mb-card-table {
  margin-bottom: 6px;

  .tableRow {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  margin-top: 20px;

  .footer-button {
    display: flex;
    margin-top: -20px;

    .cancel-button {
      display: block;
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

    .remarks-button {
      width: 100%;
    }

    .footer {
      display: block;
    }

    .due-date {
      margin-bottom: 40px;
    }

    .footer-button {
      width: 100%;
      .cancel-button {
        background-color: #f0f2f5;
      }

      .cancel-button {
        width: 50%;
      }

      .submit-button {
        width: 50%;
      }
    }
  }
}
</style>
